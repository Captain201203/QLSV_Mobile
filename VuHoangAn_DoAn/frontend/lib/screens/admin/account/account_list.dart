import 'package:flutter/material.dart';
import '../../../models/account.dart';
import '../../../services/account_service.dart';
// import 'account_form.dart'; // 

// ----------------Widget chính hiển thị danh sách tài khoản----------------
class AccountListPage extends StatefulWidget {
  const AccountListPage({super.key});

  @override
  State<AccountListPage> createState() => _AccountListPageState();
}

// ----------------State của trang — chứa danh sách tài khoản và các thao tác CRUD----------------
class _AccountListPageState extends State<AccountListPage> {
  List<Account> accounts = []; // Danh sách tài khoản
  bool loading = true; // Trạng thái đang tải dữ liệu

  @override
  void initState() {
    super.initState();
    _loadAccounts();
  }

  Future<void> _loadAccounts() async { // Hàm tải danh sách tài khoản từ API
    try {
      final data = await AccountService.generateFromStudents(); // Gọi API lấy danh sách tài khoản sinh viên
      setState((){ // Cập nhật trạng thái với dữ liệu mới
        accounts = data;
        loading =false;
      });
    } catch (e) {
      setState(() => loading = false);
       ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi tải tài khoản: $e')),
      );
      // Xử lý lỗi nếu cần
    }
  }

  Future<void> _deleteAccount(String id) async {
    try {
      await AccountService.deleteAccount(id);
      setState(() => accounts.removeWhere((e) => e.id == id)); 
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Xóa tài khoản thành công')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi khi xóa tài khoản: $e')),
      );
    }
  }

  //------------------- Giao diện hiển thị danh sách tài khoản------------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tài khoản sinh viên'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadAccounts,
            tooltip: 'Làm mới danh sách',
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: loading
            ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 16),
                    Text('Đang tải danh sách tài khoản...'),
                  ],
                ),
              )
            : accounts.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.account_circle_outlined,
                          size: 80,
                          color: Colors.grey,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Chưa có tài khoản sinh viên',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Bấm nút "Tạo tài khoản SV" để\ntự động tạo tài khoản cho sinh viên',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  )
                : RefreshIndicator(
                    onRefresh: _loadAccounts,
                    child: ListView.builder(
                      itemCount: accounts.length,
                      itemBuilder: (context, index) {
                  final a = accounts[index];
                  return Card(
                    child: ListTile(
                      // Avatar đại diện người dùng
                      leading: CircleAvatar(
                        backgroundColor: Theme.of(
                          context,
                        ).primaryColor.withValues(alpha: 0.12),
                        child: const Icon(Icons.person, color: Colors.blue),
                      ),
                      // Hiển thị tên sinh viên
                      title: Text(
                        a.studentName,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      // Hiển thị tên đăng nhập và mật khẩu
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Tài khoản: ${a.email}'),
                          Text('Mật khẩu: ${a.password}'),
                          Text('Quyền: ${a.role}'),
                          if (a.status != null) ...[
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: a.status!.contains('thành công') 
                                    ? Colors.green.withOpacity(0.2)
                                    : a.status!.contains('tồn tại')
                                        ? Colors.orange.withOpacity(0.2)
                                        : Colors.red.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                a.status!,
                                style: TextStyle(
                                  fontSize: 10,
                                  color: a.status!.contains('thành công')
                                      ? Colors.green.shade700
                                      : a.status!.contains('tồn tại')
                                          ? Colors.orange.shade700
                                          : Colors.red.shade700,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                      isThreeLine: true,
                      // Các nút chức năng chỉnh sửa và xóa
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Nút sửa tài khoản
                          IconButton(
                            icon: const Icon(Icons.edit, color: Colors.blue),
                            onPressed: () {
                              // TODO: Implement edit functionality
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Chức năng sửa: Chưa implement')),
                              );
                            },
                          ),
                          // Nút xóa tài khoản
                          IconButton(
                            icon: const Icon(Icons.delete, color: Colors.red),
                            onPressed: () => _deleteAccount(a.id),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
                    ),
      ),
      // Nút nổi để tạo tài khoản sinh viên tự động
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          // Hiển thị dialog xác nhận
          final confirm = await showDialog<bool>(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Tạo tài khoản sinh viên'),
              content: const Text(
                'Hệ thống sẽ tự động tạo tài khoản cho tất cả sinh viên:\n\n'
                '• Tài khoản: Email sinh viên\n'
                '• Mật khẩu: Mã sinh viên\n\n'
                'Bạn có muốn tiếp tục?'
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context, false),
                  child: const Text('Hủy'),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context, true),
                  child: const Text('Tạo tài khoản'),
                ),
              ],
            ),
          );

          if (confirm == true) {
            // Hiển thị loading
            showDialog(
              context: context,
              barrierDismissible: false,
              builder: (context) => const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 16),
                    Text('Đang tạo tài khoản sinh viên...', style: TextStyle(color: Colors.white)),
                  ],
                ),
              ),
            );

            try {
              // Gọi API tạo tài khoản hàng loạt
              final newAccounts = await AccountService.generateStudentAccount();
              
              // Đóng loading dialog
              Navigator.pop(context);
              
              // Cập nhật danh sách
              setState(() {
                accounts = newAccounts;
              });

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Đã tạo thành công ${newAccounts.length} tài khoản sinh viên'),
                  backgroundColor: Colors.green,
                ),
              );
            } catch (e) {
              // Đóng loading dialog
              Navigator.pop(context);
              
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Lỗi tạo tài khoản: $e'),
                  backgroundColor: Colors.red,
                ),
              );
            }
          }
        },
        backgroundColor: Theme.of(context).primaryColor,
        icon: const Icon(Icons.group_add),
        label: const Text('Tạo tài khoản SV'),
      ),
    );
  }
}
