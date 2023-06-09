<template>
    <div class="dashboard-container">
        <div class="app-container">
            <el-tabs>
                <!-- 角色管理 -->
                <el-tab-pane label="角色管理">
                    <!-- 新增角色按钮 -->
                    <el-row style="height: 60px">
                        <el-button size="small" type="primary" icon="el-icon-plus"
                            @click="showDialog = true">新增角色</el-button>
                    </el-row>
                    <!-- 新增角色按钮 -->
                    <!-- 表格信息 -->
                    <el-table stripe border="" :data="list">
                        <el-table-column align="center" type="index" label="序号" width="120">
                        </el-table-column>
                        <el-table-column align="center" prop="name" label="角色名称" width="240">
                        </el-table-column>
                        <el-table-column align="center" prop="description" label="描述">
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="{row}">
                                <el-button size="small" type="success">分配权限</el-button>
                                <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                                <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 表格信息 -->
                    <!-- 分页组件 -->
                    <el-row type="flex" justify="center" style="height:60px" align="bottom">
                        <el-pagination :current-page="page.page" :page-size="page.pagesize" :total="page.total"
                            layout="prev,pager,next" @current-change="changePage"></el-pagination>
                    </el-row>
                    <!-- 分页组件 -->
                </el-tab-pane>
                <!-- 角色管理 -->
                <!-- 基地信息 -->
                <el-tab-pane label="基地信息">
                    <!-- 提示信息 -->
                    <el-alert style="width:610px" title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon
                        :closable="false" />
                    <!-- 提示信息 -->
                    <!-- 信息展示表单 -->
                    <el-form label-width="120px" style="margin-top:50px">
                        <el-form-item label="基地名称">
                            <el-input disabled style="width:400px" v-model="formData.name"></el-input>
                        </el-form-item>
                        <el-form-item label="基地地址">
                            <el-input disabled style="width:400px" v-model="formData.companyAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="基地邮箱">
                            <el-input disabled style="width:400px" v-model="formData.mailbox"></el-input>
                        </el-form-item>
                        <el-form-item label="基地备注">
                            <el-input type="textarea" :rows="3" disabled style="width:400px"
                                v-model="formData.remarks"></el-input>
                        </el-form-item>
                    </el-form>
                    <!-- 信息展示表单 -->
                </el-tab-pane>
                <!-- 基地信息 -->
            </el-tabs>
        </div>
        <!-- 编辑弹层 -->
        <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
            <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="roleForm.name" />
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="roleForm.description" />
                </el-form-item>
            </el-form>
            <!-- 底部 -->
            <el-row slot="footer" type="flex" justify="center">
                <el-col :span="8">
                    <el-button size="small" @click="btnCancel">取消</el-button>
                    <el-button size="small" type="primary" @click="btnOK">确定</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 编辑弹层 -->
    </div>
</template>

<script>
import { getRoleListAPI, getCompanyInfoAPI, deleteRoleAPI, updateRoleAPI, getRoleDetailAPI, addRoleAPI } from "@/api/setting"
import { mapGetters } from "vuex"

export default {
    data() {
        return {
            list: [], // 承接数组
            page: {
                // 放置页码及相关数据
                page: 1,
                pagesize: 10,
                total: 0 // 记录总数
            },
            formData: {},
            showDialog: false,
            // 专门接收新增或者编辑的编辑的表单数据
            roleForm: {},
            rules: {
                name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
            }
        }
    },
    computed: {
        ...mapGetters(['companyId']),
        showTitle() {
            return this.roleForm.id ? '编辑角色' : '新增角色'
        }
    },
    created() {
        this.getRoleList()
        this.getCompanyInfo()
    },
    methods: {
        // 获取列表数据
        async getRoleList() {
            const { total, rows } = await getRoleListAPI(this.page)
            this.page.total = total
            this.list = rows
        },
        async getCompanyInfo() {
            this.formData = await getCompanyInfoAPI(this.companyId)
        },
        changePage(newPage) {
            // newPage是当前点击的页码
            this.page.page = newPage // 将当前页码赋值给当前的最新页码
            this.getRoleList()
        },
        async deleteRole(id) {
            try {
                // 提示是否确认删除
                await this.$confirm('确认删除该角色吗')
                // 点击确定，进入删除角色接口
                await deleteRoleAPI(id)
                this.getRoleList() // 重新加载数据
                this.$message.success('删除角色成功')
            } catch (error) {
                console.log(error)
            }
        },
        async editRole(id) {
            this.roleForm = await getRoleDetailAPI(id)
            // 为了不出现闪烁的问题 先获取数据 再弹出层
            this.showDialog = true
        },
        async btnOK() {
            try {
                await this.$refs.roleForm.validate()
                // 只有校验通过的情况下 才会执行await的下方内容
                // roleForm这个对象有id就是编辑 没有id就是新增
                if (this.roleForm.id) {
                    await updateRoleAPI(this.roleForm)
                } else {
                    // 新增业务
                    await addRoleAPI(this.roleForm)
                }
                // 重新拉取数据
                this.getRoleList()
                this.$message.success('操作成功')
                this.showDialog = false // 关闭弹层  =>  触发el-dialog的事件close事件
            } catch (error) {
                console.log(error)
            }
        },
        btnCancel() {
            this.roleForm = {
                name: '',
                description: ''
            }
            // 移除校验
            this.$refs.roleForm.resetFields()
            this.showDialog = false
        }
    }
}

</script>

<style></style>