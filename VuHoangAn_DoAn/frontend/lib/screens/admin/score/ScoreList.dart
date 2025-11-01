import 'package:flutter/material.dart';
import '../../../services/score_service.dart';
import '../../../models/score.dart';
import '../../../models/student.dart';
import '../../../models/subject.dart';
import '../../../services/student_service.dart';
import '../../../services/subject_service.dart';
import 'score_form_screen.dart';

class ScoreListScreen extends StatefulWidget {
  final String studentId;
  final String studentName;
  final String className;
  final String subjectId;
  final String subjectName;

  const ScoreListScreen({
    super.key,
    required this.studentId,
    required this.studentName,
    required this.className,
    required this.subjectId,
    required this.subjectName
  });

  @override
  State<ScoreListScreen> createState() => _ScoreListScreenState();
}

class _ScoreListScreenState extends State<ScoreListScreen> {
  late Future<List<Score>> _scores;
  late Future<List<Subject>> _subjects;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    _scores = ScoreService.getScoresByStudent(widget.studentId);
    _subjects = StudentService.getSubjectsByStudent(widget.studentId);
  }

  Future<void> _refreshData() async {
    setState(() {
      _loadData();
    });
  }

  Future<void> _deleteScore(Score score) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận xóa'),
        content: Text('Bạn có chắc muốn xóa điểm môn ${score.subjectName}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Xóa', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await ScoreService.deleteScore(score.id);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Xóa điểm thành công')),
        );
        _refreshData();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi khi xóa: $e')),
        );
      }
    }
  }

  void _navigateToScoreForm({Score? existingScore, Subject? subject}) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ScoreFormScreen(
          studentId: widget.studentId,
          studentName: widget.studentName,
          subjectId: widget.subjectId, // Sử dụng subjectId từ widget
          subjectName: widget.subjectName, // Sử dụng subjectName từ widget
          className: widget.className,
          existingScore: existingScore,
        ),
      ),
    ).then((_) => _refreshData());
  }

  Widget _buildScoreTable(List<Score> scores) {
    if (scores.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Text('Chưa có điểm nào', style: TextStyle(fontSize: 16)),
        ),
      );
    }

    // Nhóm điểm theo năm học và học kỳ
    final grouped = <String, List<Score>>{};
    for (final score in scores) {
      final key = '${score.academicYear} - ${score.semester}';
      grouped.putIfAbsent(key, () => []).add(score);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: grouped.entries.map((entry) {
        final period = entry.key;
        final periodScores = entry.value;

        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.school, color: Colors.blue.shade700),
                    const SizedBox(width: 8),
                    Text(
                      '📘 $period',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    columns: const [
                      DataColumn(label: Text('Môn học', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('Giữa kỳ', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('Cuối kỳ', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('Tổng kết', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('GPA', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('Điểm chữ', style: TextStyle(fontWeight: FontWeight.bold))),
                      DataColumn(label: Text('Thao tác', style: TextStyle(fontWeight: FontWeight.bold))),
                    ],
                    rows: periodScores.map((score) {
                      return DataRow(
                        cells: [
                          DataCell(
                            Text(
                              score.subjectName,
                              style: const TextStyle(fontWeight: FontWeight.w500),
                            ),
                          ),
                          DataCell(Text(score.ex1Score.toStringAsFixed(1))),
                          DataCell(Text(score.ex2Score.toStringAsFixed(1))),
                          DataCell(
                            Text(
                              score.finalScore.toStringAsFixed(1),
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: score.finalScore >= 5 ? Colors.green : Colors.red,
                              ),
                            ),
                          ),
                          DataCell(
                            Text(
                              score.GPA.toStringAsFixed(2),
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: score.GPA >= 2.0 ? Colors.green : Colors.red,
                              ),
                            ),
                          ),
                          DataCell(
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _getGradeColor(score.letterGrade),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                score.letterGrade,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          DataCell(
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.edit, color: Colors.blue),
                                  onPressed: () => _navigateToScoreForm(existingScore: score),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.delete, color: Colors.red),
                                  onPressed: () => _deleteScore(score),
                                ),
                              ],
                            ),
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Color _getGradeColor(String grade) {
    switch (grade) {
      case 'A+':
      case 'A':
        return Colors.green;
      case 'B+':
      case 'B':
        return Colors.blue;
      case 'C+':
      case 'C':
        return Colors.orange;
      case 'D+':
      case 'D':
        return Colors.red.shade300;
      case 'F':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Widget _buildAddScoreButton() {
    return FutureBuilder<List<Subject>>(
      future: _subjects,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const SizedBox.shrink();
        }

        final subjects = snapshot.data ?? [];
        if (subjects.isEmpty) {
          return const SizedBox.shrink();
        }

        return Card(
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: Colors.green.shade100,
              child: const Icon(Icons.add, color: Colors.green),
            ),
            title: const Text('Thêm điểm mới'),
            trailing: const Icon(Icons.arrow_forward_ios), 
            onTap: () => _navigateToScoreForm(),
          ),
        );
      },
    );
  }

  

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: Text('Điểm số - ${widget.studentName}'),
        backgroundColor: Colors.blue.shade700,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refreshData,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Thông tin sinh viên
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: Colors.blue.shade100,
                          child: Text(
                            widget.studentName.isNotEmpty 
                                ? widget.studentName[0].toUpperCase() 
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
                                widget.studentName,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text('MSSV: ${widget.studentId}'),
                              Text('Lớp: ${widget.className}'),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Nút thêm điểm
            _buildAddScoreButton(),

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

                final scores = snapshot.data ?? [];
                return _buildScoreTable(scores);
              },
            ),
          ],
        ),
      ),
    );
  }
}