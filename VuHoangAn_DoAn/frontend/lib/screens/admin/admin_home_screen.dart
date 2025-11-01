// Tạo file: frontend/lib/screens/admin/admin_home_screen.dart
import 'package:flutter/material.dart';
import 'nav_wrapper.dart'; // Import admin navigation

class AdminHomeScreen extends StatelessWidget {
  const AdminHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const NavWrapper(); // Sử dụng lại admin navigation
  }
}