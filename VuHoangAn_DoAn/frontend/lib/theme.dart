import 'package:flutter/material.dart';

// ================== THEME COLORS ==================
const Color kPrimary = Color(0xFF2196F3);
const Color kPrimaryDark = Color(0xFF1976D2);
const Color kBackground = Color(0xFFF5F5F5);
const Color kSurface = Colors.white;
const Color kError = Color(0xFFE53E3E);
const Color kSuccess = Color(0xFF38A169);
const Color kWarning = Color(0xFFD69E2E);

// ================== TEXT STYLES ==================
const TextStyle kHeadingStyle = TextStyle(
  fontSize: 24,
  fontWeight: FontWeight.bold,
  color: kPrimary,
);

const TextStyle kSubHeadingStyle = TextStyle(
  fontSize: 18,
  fontWeight: FontWeight.w600,
  color: Colors.black87,
);

const TextStyle kBodyStyle = TextStyle(
  fontSize: 14,
  color: Colors.black54,
);

// ================== THEME DATA ==================
ThemeData get appTheme {
  return ThemeData(
    primarySwatch: Colors.blue,
    primaryColor: kPrimary,
    scaffoldBackgroundColor: kBackground,
    appBarTheme: const AppBarTheme(
      backgroundColor: kPrimary,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: kPrimary,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    ),
  );
}
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.school_outlined),
//             activeIcon: Icon(Icons.school, color: Color(0xFF2196F3)),
//             label: 'Students',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.calendar_today_outlined),
//             activeIcon: Icon(Icons.calendar_today, color: Color(0xFF2196F3)),
//             label: 'Schedule',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.person_outline),
//             activeIcon: Icon(Icons.person, color: Color(0xFF2196F3)),
//             label: 'Accounts',
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.book_outlined),
//             activeIcon: Icon(Icons.book, color: Color(0xFF2196F3)),
//             label: 'Subjects', // ✅ thêm label Môn học
//           ),
//           BottomNavigationBarItem(
//             icon: Icon(Icons.settings_outlined),
//             activeIcon: Icon(Icons.settings, color: Color(0xFF2196F3)),
//             label: 'Settings',
//           ),
//         ],
//       ),
//     );
//   }
// }
