<template>
    <!-- 公共导入组件 -->
    <upload-excel :on-success="onSuccess" />
</template>

<script>
import { importEmployeeAPI } from '@/api/employees'
export default {
    data() {
        return {

        }
    },
    methods: {
        async onSuccess({ header, results }) {
            // console.log(results)
            // 如果是导入员工
            const userRelations = {
                '入职日期': 'timeOfEntry',
                '手机号': 'mobile',
                '姓名': 'username',
                '转正日期': 'correctionTime',
                '工号': 'workNumber'
            }
            const arr = []
            results.forEach(item => {
                const userInfo = {}
                Object.keys(item).forEach(key => {
                    if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
                        userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样, 才能入库
                    } else {
                        userInfo[userRelations[key]] = item[key]
                    }
                })
                arr.push(userInfo)
            })
            // 调用导入接口
            await importEmployeeAPI(arr)
            this.$router.back()
        },
        // 格式化导入时间
        formatDate(numb, format) {
            const time = new Date((numb - 1) * 24 * 3600000 + 1)
            time.setYear(time.getFullYear() - 70)
            const year = time.getFullYear() + ''
            const month = time.getMonth() + 1 + ''
            const date = time.getDate() - 1 + ''
            if (format && format.length === 1) {
                return year + format + month + format + date
            }
            return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
        }
    },
}
</script>