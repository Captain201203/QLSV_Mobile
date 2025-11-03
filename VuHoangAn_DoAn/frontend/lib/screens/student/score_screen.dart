import 'package:flutter/material.dart';
import '../../services/score_service.dart';
import '../../models/score.dart';
import '../../models/student.dart';

class ScoreScreen extends StatefulWidget {
  final Student student;

  const ScoreScreen({super.key, required this.student});

  @override
  State<ScoreScreen> createState() => _ScoreScreenState();
}

class _ScoreScreenState extends State<ScoreScreen> {
  late Future<List<Score>> _scores;
  String _selectedSemester = 'HK1';
  String _selectedYear = '2024-2025';

  @override
  void initState() {
    super.initState();
    _loadScores();
  }

  void _loadScores() {
    _scores = ScoreService.getScoresByStudent(widget.student.studentId);
  }

  Future<void> _refreshScores() async {
    setState(() {
      _loadScores();
    });
  }

  List<Score> _filterScoresBySemester(List<Score> scores) {
    return scores.where((score) => 
      score.semester == _selectedSemester && 
      score.academicYear == _selectedYear
    ).toList();
  }

  double _calculateGPA(List<Score> scores) {
    if (scores.isEmpty) return 0.0;
    
    double totalPoints = 0.0;
    int totalCredits = 0;
    
    for (final score in scores) {
      // Giả sử mỗi môn có 3 tín chỉ (có thể lấy từ subject model)
      int credits = 3; // Cần lấy từ subject model thực tế
      totalPoints += score.GPA * credits;
      totalCredits += credits;
    }
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0.0;
  }

  int _calculateTotalCredits(List<Score> scores) {
    return scores.length * 3; // Giả sử mỗi môn 3 tín chỉ
  }

  Widget _buildScoreTable(List<Score> scores) {
    if (scores.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(32),
        child: const Center(
          child: Text(
            'Chưa có điểm cho học kỳ này',
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
        ),
      );
    }

    return Table(
      border: TableBorder.all(color: Colors.grey.shade300),
      columnWidths: const {
        0: FlexColumnWidth(3), // Mã học phần
        1: FlexColumnWidth(4), // Tên học phần
        2: FlexColumnWidth(1), // STC
        3: FlexColumnWidth(1), // KT1
        4: FlexColumnWidth(1), // KT2
        5: FlexColumnWidth(1), // Thi
        6: FlexColumnWidth(1), // TK(10)
        7: FlexColumnWidth(1), // TK(CH)
        8: FlexColumnWidth(1), // TK(4)
      },
      children: [
        // Header row
        TableRow(
          decoration: const BoxDecoration(color: Color(0xFFE3F2FD)),
          children: [
            _buildHeaderCell('Mã học phần'),
            _buildHeaderCell('Tên học phần'),
            _buildHeaderCell('STC'),
            _buildHeaderCell('KT1'),
            _buildHeaderCell('KT2'),
            _buildHeaderCell('Thi'),
            _buildHeaderCell('TK(10)'),
            _buildHeaderCell('TK(CH)'),
            _buildHeaderCell('TK(4)'),
          ],
        ),
        // Data rows
        ...scores.map((score) => _buildScoreRow(score)).toList(),
      ],
    );
  }

  Widget _buildHeaderCell(String text) {
    return Container(
      padding: const EdgeInsets.all(8.0),
      child: Text(
        text,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  TableRow _buildScoreRow(Score score) {
    return TableRow(
      decoration: const BoxDecoration(color: Colors.white),
      children: [
        _buildDataCell(score.subjectId, isCode: true),
        _buildDataCell(score.subjectName, isName: true),
        _buildDataCell('3'), // STC - cần lấy từ subject model
        _buildDataCell(score.ex1Score > 0 ? score.ex1Score.toStringAsFixed(1) : '-'),
        _buildDataCell(score.ex2Score > 0 ? score.ex2Score.toStringAsFixed(1) : '-'),
        _buildDataCell(score.finalScore > 0 ? score.finalScore.toStringAsFixed(1) : '-'),
        _buildDataCell(score.finalScore > 0 ? score.finalScore.toStringAsFixed(1) : '-'),
        _buildDataCell(score.letterGrade.isNotEmpty ? score.letterGrade : '-'),
        _buildDataCell(score.GPA > 0 ? score.GPA.toStringAsFixed(2) : '-'),
      ],
    );
  }

  Widget _buildDataCell(String text, {bool isCode = false, bool isName = false}) {
    return Container(
      padding: const EdgeInsets.all(8.0),
      child: Text(
        text,
        style: TextStyle(
          fontSize: isCode ? 11 : 12,
          fontWeight: isCode ? FontWeight.w500 : FontWeight.normal,
        ),
        textAlign: isName ? TextAlign.left : TextAlign.center,
        maxLines: isName ? 2 : 1,
        overflow: isName ? TextOverflow.ellipsis : TextOverflow.visible,
      ),
    );
  }

  Widget _buildSemesterSelector() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.blue.shade200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Make the left label flexible so it can wrap/ellipsis on small screens
          Expanded(
            child: Text(
              'Học kỳ $_selectedSemester năm học $_selectedYear',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(width: 8),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButton<String>(
                value: _selectedSemester,
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    setState(() {
                      _selectedSemester = newValue;
                    });
                  }
                },
                items: ['HK1', 'HK2', 'HK3'].map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
              ),
              const SizedBox(width: 8),
              DropdownButton<String>(
                value: _selectedYear,
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    setState(() {
                      _selectedYear = newValue;
                    });
                  }
                },
                items: ['2023-2024', '2024-2025', '2025-2026'].map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
              ),
              IconButton(
                icon: const Icon(Icons.refresh, color: Colors.blue),
                onPressed: _refreshScores,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummary(List<Score> scores) {
    final gpa = _calculateGPA(scores);
    final totalCredits = _calculateTotalCredits(scores);
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Điểm trung bình học kỳ (hệ 4): ${gpa.toStringAsFixed(2)}',
            style: TextStyle(
              fontSize: 15,
              color: gpa >= 2.0 ? Colors.green : Colors.red,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Điểm trung bình tích lũy (hệ 4): ${gpa.toStringAsFixed(2)}', // Cần tính từ tất cả học kỳ
            style: const TextStyle(fontSize: 15),
          ),
          const SizedBox(height: 4),
          Text(
            'Số tín chỉ đạt: $totalCredits',
            style: const TextStyle(fontSize: 15),
          ),
          const SizedBox(height: 4),
          Text(
            'Số tín chỉ tích lũy: $totalCredits', // Cần tính từ tất cả học kỳ
            style: const TextStyle(fontSize: 15),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Điểm - ${widget.student.studentName}'),
        backgroundColor: Colors.blue.shade700,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thông tin sinh viên
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.blue.shade200),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: Colors.blue.shade100,
                    child: Text(
                      widget.student.studentName.isNotEmpty 
                          ? widget.student.studentName[0].toUpperCase() 
                          : "?",
                      style: TextStyle(
                        color: Colors.blue.shade800,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.student.studentName,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text('MSSV: ${widget.student.studentId}'),
                        Text('Lớp: ${widget.student.className}'),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Chọn học kỳ
            _buildSemesterSelector(),

            const SizedBox(height: 16),

            // Bảng điểm
            FutureBuilder<List<Score>>(
              future: _scores,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: CircularProgressIndicator(),
                    ),
                  );
                }

                if (snapshot.hasError) {
                  return Center(
                    child: Text('Lỗi: ${snapshot.error}'),
                  );
                }

                final allScores = snapshot.data ?? [];
                final filteredScores = _filterScoresBySemester(allScores);

                return Column(
                  children: [
                    _buildScoreTable(filteredScores),
                    const SizedBox(height: 16),
                    _buildSummary(filteredScores),
                  ],
                );
              },
            ),

            const SizedBox(height: 16),

            // Xem tất cả học kỳ
            GestureDetector(
              onTap: () {
                // Navigate to all semesters view
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: const Text(
                  'Xem tất cả học kỳ >>',
                  style: TextStyle(
                    color: Colors.blue,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}