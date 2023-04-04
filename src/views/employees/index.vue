<template>
    <div class="dashboard-container">
        <div class="app-container">
            <!-- 头部信息栏 -->
            <page-tools :show-before="true">
                <span slot="before">共{{ this.page.total }}条记录</span>
                <template slot="after">
                    <el-button icon="el-icon-folder-add" size="small" type="success" @click="$router.push('/import')">导入
                        excel</el-button>
                    <el-button icon="el-icon-folder-remove" size="small" type="warning" @click="exportData">导出
                        excel</el-button>
                    <el-button icon="el-icon-folder-remove" size="small" type="info" @click="exportMutiData">导出复杂表头
                        excel</el-button>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog = true">新增员工</el-button>
                </template>
            </page-tools>
            <!-- 头部信息栏 -->
            <el-card v-loading="loading">
                <!-- 表格位置 -->
                <el-table border :data="list">
                    <el-table-column align="center" label="序号" width="60" sortable="" type="index" />
                    <el-table-column align="center" label="姓名" sortable="" prop="username" />
                    <el-table-column align="center" label="工号" sortable="" prop="workNumber" />
                    <el-table-column align="center" prop="mobile" label="手机号" sortable />
                    <el-table-column align="center" label="聘用形式" sortable="" prop="formOfEmployment"
                        :formatter="formatEmployment" />
                    <el-table-column align="center" label="部门" sortable="" prop="departmentName" />
                    <el-table-column align="center" label="入职时间" sortable="">
                        <!-- 作用域插槽 -->
                        <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
                    </el-table-column>
                    <el-table-column align="center" label="账户状态" sortable="">
                        <template slot-scope="{ row }">
                            <!-- 根据当前状态来确定 是否打开开关 -->
                            <el-switch active-color="#13ce66" inactive-color="#ff4949" :value="row.enableState === 1" />
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" sortable="" fixed="right" width="280">
                        <template v-slot="{ row }">
                            <el-button type="text" size="small"
                                @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
                            <el-button type="text" size="small">转正</el-button>
                            <el-button type="text" size="small">调岗</el-button>
                            <el-button type="text" size="small">离职</el-button>
                            <el-button type="text" size="small">角色</el-button>
                            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 表格位置 -->
                <!-- 分页组件位置 -->
                <el-row type="flex" justify="center" align="bottom" style="height: 50px">
                    <el-pagination layout="prev, pager, next" :page-size="page.size" :current-page="page.page"
                        :total="page.total" @current-change="changePage" />
                </el-row>
                <!-- 分页组件位置 -->
            </el-card>
        </div>
        <!-- 新增员工组件 -->
        <AddDemployee :show-dialog.sync="showDialog" />
        <!-- 新增员工组件 -->
    </div>
</template>

<script>
import { getEmployeeListAPI, delEmployeeAPI } from '@/api/employees'
import EmployeeEnum from "@/api/constant/employees"
import AddDemployee from './components/add-employee'
import { formatDate } from '@/filters'

export default {
    components: {
        AddDemployee
    },
    data() {
        return {
            loading: false,
            list: [], // 接受员工数据
            page: {
                page: 1, // 当前页码
                size: 10,
                total: 0 // 总数
            },
            showDialog: false, // 新增员工弹层
        }
    },
    created() {
        this.getEmployeeList()
    },
    methods: {
        changePage(newPage) {
            this.page.page = newPage
            this.getEmployeeList()
        },
        async getEmployeeList() {
            this.loading = true
            const { total, rows } = await getEmployeeListAPI(this.page)
            this.page.total = total
            this.list = rows
            this.loading = false
        },
        formatEmployment(row, column, cellValue, index) {
            // console.log(row, column, cellValue, index)
            // 要去找 1所对应的值
            const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
            return obj ? obj.value : '未知'
        },
        // 删除员工
        async deleteEmployee(id) {
            try {
                await this.$confirm('您确定删除该员工吗')
                await delEmployeeAPI(id)
                this.getEmployeeList()
                this.$message.success('删除员工成功')
            } catch (error) {
                console.log(error)
            }
        },
        // 导出excel数据
        exportData() {
            // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
            const headers = {
                '姓名': 'username',
                '手机号': 'mobile',
                '入职日期': 'timeOfEntry',
                '聘用形式': 'formOfEmployment',
                '转正日期': 'correctionTime',
                '工号': 'workNumber',
                '部门': 'departmentName'
            }
            import('@/vendor/Export2Excel').then(async excel => {
                // 获取所有的员工列表数据
                const { rows } = await getEmployeeListAPI({ page: 1, size: this.page.total })
                // rows是所有的员工列表数据
                // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]

                // excel导出的默认对象
                excel.export_json_to_excel({
                    filename: '人力资源表',
                    header: Object.keys(headers),
                    data: this.formatJSON(headers, rows)
                })
            })
        },
        // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]
        // 数据的顺序是按照headers中key的顺序来的
        // 格式化json数据
        formatJSON(headers, rows) {
            // rows 是一行一行的  =>  [{},{}] => [[],[]]
            return rows.map(item => {
                // item {username: '张三', mobile: 123}  现在是对象 => []
                // ["姓名","手机号"] => [ '张三', '123']
                return Object.keys(headers).map(key => {
                    // key是中文 headers[key]是英文 // item是 英文 {username: '张三', mobile: 123}
                    if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
                        // 如果是日期的话 就需要格式化日期
                        return formatDate(item[headers[key]])
                    } else if (headers[key] === 'formOfEmployment') {
                        // 要把聘用形式转化成文本
                        const obj = EmployeeEnum.hireType.find(o => o.id === item[headers[key]])
                        return obj ? obj.value : '未知'
                    }
                    return item[headers[key]]
                })
            })
            // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
        },
        // 导出复杂表头
        exportMutiData() {
            // 懒加载模块 => 只有当点击按钮的时候才去加载这个模块
            const headers = {
                '姓名': 'username',
                '手机号': 'mobile',
                '入职日期': 'timeOfEntry',
                '聘用形式': 'formOfEmployment',
                '转正日期': 'correctionTime',
                '工号': 'workNumber',
                '部门': 'departmentName'
            }
            import('@/vendor/Export2Excel').then(async excel => {
                // 获取所有的员工列表数据
                const { rows } = await getEmployeeListAPI({ page: 1, size: this.page.total })
                // rows是所有的员工列表数据
                // [{ username: '张三', mobile: 123 }]  => [[ '张三', 123 ]]

                // excel导出的默认对象
                excel.export_json_to_excel({
                    filename: '人力资源表(复杂表头)',
                    header: Object.keys(headers),
                    // mutiHeader中表头的长度必须和header的表头长度是对应的 否则报错
                    multiHeader: [['姓名', '主要信息', '', '', '', '', '部门']], // 复杂表头的导出 数组中的一个数组 就是一行表头
                    data: this.formatJSON(headers, rows),
                    merges: ['A1:A2', 'B1:F1', 'G1:G2'] // 合并列  不用区分顺序 只写合并的单元格的顺序号
                })
            })
        }
    },
}
</script>

<style></style>