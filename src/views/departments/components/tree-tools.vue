<template>
    <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">

        <el-col :span="12">
            <el-row type="flex" justify="start">
                <!-- 名称应该变成 对应的节点中的name -->
                <span>{{ treeNode.name }}</span>
            </el-row>
        </el-col>
        <el-col :span="12">
            <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col :span="6">{{ treeNode.manager }}</el-col>
                <el-col :span="6">
                    <!-- 下拉菜单 element -->
                    <el-dropdown @command="operateDepts">
                        <span>
                            操作<i class="el-icon-arrow-down" />
                        </span>
                        <!-- 下拉菜单 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                            <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
                            <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import { delDepartmentsAPI } from "@/api/departments"
// 该组件需要对外开放属性 外部需要提供一个对象 对象里需要有name  manager
export default {
    name: "TreeTools",
    // props可以用数组来接收数据 也可以用对象来接收
    // props: {   props属性: {  配置选项 }  }
    props: {
        //   定义一个props属性
        treeNode: {
            type: Object, // 对象类型
            required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
        },
        // 是否是根节点
        isRoot: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 操作节点调用的方法
        operateDepts(type) {
            if (type === 'add') {
                // 添加子部门的操作
                // 告诉父组件 显示弹层
                this.$emit('addDepts', this.treeNode) // 为何传出treeNode 因为是添加子部门 需要当前部门的数据
            } else if (type === 'edit') {
                //  编辑部门的操作
                this.$emit('editDepts', this.treeNode)
            } else {
                //  删除操作
                this.$confirm('确定要删除该部门吗').then(() => {
                    // 如果点击了确定就会进入then
                    return delDepartmentsAPI(this.treeNode.id) // 返回promise对象
                }).then(() => {
                    // 如果删除成功了  就会进入这里
                    this.$emit('delDepts') // 触发自定义事件
                    this.$message.success('删除部门成功')
                })
            }
        }
    },
}
</script> 

<style  lang="scss">
.tree-card {
    padding: 30px 100px;
    font-size: 20px;

    .el-dropdown {
        font-size: 20px;
        color: #303133;
    }
}
</style>