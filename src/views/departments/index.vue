<template>
    <div v-loading="loading" class="dashboard-container">
        <div class="app-container">
            <el-card class="tree-card">
                <!-- 使用 elui 行列布局 -->
                <!-- 组织架构-头部 -->
                <tree-tools :treeNode="company" :isRoot="true" @addDepts="addDepts" />
                <!-- 组织架构-头部 -->
                <!-- 组织架构-详情 -->
                <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
                    <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
                    <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
                    <tree-tools slot-scope="{ data }" :treeNode="data" @delDepts="getDepartments" @addDepts="addDepts"
                        @editDepts="editDepts" />
                </el-tree>
                <!-- 组织架构-详情 -->
            </el-card>
        </div>
        <!-- 放置新增弹层组件  -->
        <add-dept ref="addDept" :showDialog.sync="showDialog" :treeNode="node" @addDepts="getDepartments"></add-dept>
    </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue"
import AddDept from './components/add-dept' // 引入新增部门组件
import { getDepartmentsAPI } from '@/api/departments'
import { tranListToTreeData } from "@/utils/index"

export default {
    components: {
        TreeTools,
        AddDept
    },
    data() {
        return {
            departs: [],
            defaultProps: {
                label: 'name' // 表示 从这个属性显示内容
            },
            company: {}, // 就是头部的数据结构
            showDialog: false, // 显示窗体
            node: null, // 专门来存储当前操作的节点
            loading: false // 用来控制进度弹层的显示和隐藏
        }
    },
    created() {
        this.getDepartments() // 调用自身的方法
    },
    methods: {
        async getDepartments() {
            this.loading = true
            const result = await getDepartmentsAPI()
            this.departs = tranListToTreeData(result.depts, "") // 需要将其转化成树形结构
            this.company = { name: result.companyName, manager: '负责人', id: '' }
            this.loading = false
        },
        addDepts(node) {
            this.showDialog = true // 显示弹层
            // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
            this.node = node
        },
        // 编辑部门节点
        editDepts(node) {
            // 首先打开弹层
            this.showDialog = true
            this.node = node // 赋值操作的节点
            // 父组件 调用子组件的方法
            this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
        }
    }
}
</script>

<style scoped lang="scss">
.tree-card {
    padding: 30px 100px;
    font-size: 20px;

    .el-dropdown {
        font-size: 20px;
        color: #303133;
    }
}
</style>