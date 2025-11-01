// import 'package:flutter/material.dart';
// import '../../../models/account.dart';
// import '../../../services/account_service.dart';

// class AccountFormPage extends StatefulWidget {
//   final Account? account;

//   const AccountFormPage({super.key, this.account});

//   @override
//   State<AccountFormPage> createState() => _AccountFormPageState();
// }

// class _AccountFormPageState extends State<AccountFormPage> {
//   final _formKey = GlobalKey<FormState>();

//   late TextEditingController _emailCtrl;
//   late TextEditingController _passwordCtrl;
//   late TextEditingController _roleCtrl;

//   bool _loading = false;

//   @override
//   void initState() {
//     super.initState();
//     _emailCtrl = TextEditingController(text: widget.account?.email ?? '');
//     _passwordCtrl = TextEditingController(text: widget.account?.password ?? '');
//     _roleCtrl = TextEditingController(text: widget.account?.role ?? 'sinh viên');
//   }

//   @override
//   void dispose() {
//     _emailCtrl.dispose();
//     _passwordCtrl.dispose();
//     _roleCtrl.dispose();
//     super.dispose();
//   }

//   Future<void> _save() async {
//     if (!_formKey.currentState!.validate()) return;

//     setState(() => _loading = true);

//     final acc = Account(
//       id: widget.account?.id,
//       email: _emailCtrl.text.trim(),
//       password: _passwordCtrl.text,
//       role: _roleCtrl.text.trim(),
//     );

//     try {
//       if (widget.account == null) {
//         // ➕ Thêm mới
//         final newAcc = await AccountService.createAccount(acc);
//         if (!mounted) return;
//         Navigator.pop(context, newAcc);
//       } else {
//         // ✏️ Cập nhật
//         final updated = await AccountService.updateAccount(acc.id!, acc);
//         if (!mounted) return;
//         Navigator.pop(context, updated);
//       }
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Lỗi: $e')),
//       );
//     } finally {
//       if (mounted) setState(() => _loading = false);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     final isEdit = widget.account != null;

//     return Scaffold(
//       appBar: AppBar(title: Text(isEdit ? 'Sửa tài khoản' : 'Thêm tài khoản')),
//       body: Padding(
//         padding: const EdgeInsets.all(16),
//         child: Form(
//           key: _formKey,
//           child: ListView(
//             children: [
//               // Email
//               TextFormField(
//                 controller: _emailCtrl,
//                 decoration: const InputDecoration(labelText: 'Email'),
//                 validator: (v) {
//                   if (v == null || v.isEmpty) return 'Không được để trống';
//                   if (!v.contains('@')) return 'Email không hợp lệ';
//                   return null;
//                 },
//               ),
//               const SizedBox(height: 12),

//               // Mật khẩu
//               TextFormField(
//                 controller: _passwordCtrl,
//                 decoration: const InputDecoration(labelText: 'Mật khẩu'),
//                 obscureText: true,
//                 validator: (v) => v == null || v.isEmpty ? 'Không được để trống' : null,
//               ),
//               const SizedBox(height: 12),

//               // Quyền
//               TextFormField(
//                 controller: _roleCtrl,
//                 decoration: const InputDecoration(labelText: 'Vai trò (admin / sinh viên)'),
//                 validator: (v) => v == null || v.isEmpty ? 'Không được để trống' : null,
//               ),
//               const SizedBox(height: 20),

//               // Nút Lưu
//               ElevatedButton.icon(
//                 onPressed: _loading ? null : _save,
//                 icon: _loading
//                     ? const SizedBox(
//                         height: 18,
//                         width: 18,
//                         child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
//                       )
//                     : const Icon(Icons.save),
//                 label: Text(isEdit ? 'Lưu thay đổi' : 'Thêm tài khoản'),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }
