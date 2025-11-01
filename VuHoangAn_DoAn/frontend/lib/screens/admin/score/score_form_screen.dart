import 'package:flutter/material.dart';
import '../../../services/score_service.dart';
import '../../../models/score.dart';

class ScoreFormScreen extends StatefulWidget {
  final String studentId;
  final String studentName;
  final String subjectId;
  final String subjectName;
  final String className;
  final Score? existingScore;

  const ScoreFormScreen({
    super.key,
    required this.studentId,
    required this.studentName,
    required this.subjectId,
    required this.subjectName,
    required this.className,
    this.existingScore
  });

  @override
  State<ScoreFormScreen> createState() => _ScoreFormScreenState();
}

class _ScoreFormScreenState extends State<ScoreFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _ex1Controller = TextEditingController();
  final _ex2Controller = TextEditingController();
  final _finalController = TextEditingController();
  final _semesterController = TextEditingController();
  final _academicYearController = TextEditingController();

  Score? _existingScore;
  bool _loading = false;
  late Future<List<Score>> _studentScores;

  @override
  void initState() {
    super.initState();
    _semesterController.text = 'HK1';
    _academicYearController.text = '2024-2025';
     _studentScores = ScoreService.getScoresByStudent(widget.studentId);
     if (widget.existingScore != null) {
      _loadExistingData(widget.existingScore!);
    } 
    // else {
    //   _loadExistingScore();
    // }
  }

  @override
  void dispose() {
    _ex1Controller.dispose();
    _ex2Controller.dispose();
    _finalController.dispose();
    _semesterController.dispose();
    _academicYearController.dispose();
    super.dispose();
  }

  Future<void> _loadExistingScore() async {
    try {
      final score = await ScoreService.getByStudentAndSubject(
        widget.studentId,
        widget.subjectId,
      );
      if (score != null) {
        setState(() => _existingScore = score);
        _loadExistingData(score);
      }
    } catch (e) {
      // Không có điểm hiện tại
    }
  }

  void _loadExistingData(Score score) {
    _ex1Controller.text = score.ex1Score.toString();
    _ex2Controller.text = score.ex2Score.toString();
    _finalController.text = score.finalScore.toString();
    _semesterController.text = score.semester;
    _academicYearController.text = score.academicYear;
  }

  String? _validateScore(String? value, String fieldName) {
    if (value == null || value.isEmpty) {
      return '$fieldName không được để trống';
    }
    final score = double.tryParse(value);
    if (score == null) return '$fieldName phải là số';
    if (score < 0 || score > 10) return '$fieldName phải từ 0.0 đến 10.0';
    return null;
  }

  Future<void> _save() async {
  if (!_formKey.currentState!.validate()) return;
  setState(() => _loading = true);

  try {
    final scoreData = {
      'studentId': widget.studentId,
      'subjectId': widget.subjectId,
      'ex1Score': double.parse(_ex1Controller.text),
      'ex2Score': double.parse(_ex2Controller.text),
      'finalScore': double.parse(_finalController.text),
      'semester': _semesterController.text,
      'academicYear': _academicYearController.text,
    };

    print('📤 Score data being sent:');
    print('studentId: ${scoreData['studentId']}');
    print('subjectId: ${scoreData['subjectId']}');
    print('Full data: $scoreData');

    // ✅ Kiểm tra cả widget.existingScore và _existingScore
    if (widget.existingScore != null || _existingScore != null) {
      final scoreId = widget.existingScore?.id ?? _existingScore?.id;
      await ScoreService.updateScore(scoreId!, scoreData);
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Cập nhật điểm thành công')));
    } else {
      await ScoreService.createScore(scoreData);
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Tạo điểm thành công')));
    }

    setState(() {
      _studentScores = ScoreService.getScoresByStudent(widget.studentId);
    });

  } catch (e) {
    print('❌ Error: $e');
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text('Lỗi: $e')));
  } finally {
    setState(() => _loading = false);
  }
}

  Widget _buildScoreTable(List<Score> scores) {
    if (scores.isEmpty) {
      return const Center(child: Text('Chưa có điểm nào'));
    }

    // Nhóm điểm theo năm học và học kỳ
    final grouped = <String, List<Score>>{};
    for (final s in scores) {
      final key = '${s.academicYear} - ${s.semester}';
      grouped.putIfAbsent(key, () => []).add(s);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: grouped.entries.map((entry) {
        final label = entry.key;
        final items = entry.value;

        return Card(
          margin: const EdgeInsets.only(top: 16),
          child: Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '📘 $label',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 8),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    columns: const [
                      DataColumn(label: Text('Môn học')),
                      DataColumn(label: Text('Giữa kỳ')),
                      DataColumn(label: Text('Cuối kỳ')),
                      DataColumn(label: Text('Tổng kết')),
                      DataColumn(label: Text('Điểm chữ')),
                    ],
                    rows: items.map((score) {
                      return DataRow(cells: [
                        DataCell(Text(score.subjectName)),
                        DataCell(Text(score.ex1Score.toStringAsFixed(1))),
                        DataCell(Text(score.ex2Score.toStringAsFixed(1))),
                        DataCell(Text(score.finalScore.toStringAsFixed(1))),
                        DataCell(Text(score.letterGrade)),
                      ]);
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_existingScore != null ? 'Sửa điểm' : 'Nhập điểm'),
        actions: [
          TextButton(
            onPressed: _loading ? null : _save,
            child: _loading
                ? const SizedBox(
                    width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('Lưu', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Thông tin', style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 8),
                    Text('Sinh viên: ${widget.studentName}'),
                    Text('MSSV: ${widget.studentId}'),
                    Text('Môn học: ${widget.subjectName}'),
                    Text('Mã môn: ${widget.subjectId}'),
                    Text('Lớp: ${widget.className}'),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Form nhập điểm
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    TextFormField(
                      controller: _ex1Controller,
                      decoration: const InputDecoration(labelText: 'Điểm giữa kỳ'),
                      keyboardType: TextInputType.number,
                      validator: (v) => _validateScore(v, 'Điểm giữa kỳ'),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _ex2Controller,
                      decoration: const InputDecoration(labelText: 'Điểm cuối kỳ'),
                      keyboardType: TextInputType.number,
                      validator: (v) => _validateScore(v, 'Điểm cuối kỳ'),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _finalController,
                      decoration: const InputDecoration(labelText: 'Điểm tổng kết'),
                      keyboardType: TextInputType.number,
                      validator: (v) => _validateScore(v, 'Điểm tổng kết'),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _semesterController,
                      decoration: const InputDecoration(labelText: 'Học kỳ'),
                      validator: (v) => v == null || v.isEmpty ? 'Học kỳ không được để trống' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _academicYearController,
                      decoration: const InputDecoration(labelText: 'Năm học'),
                      validator: (v) => v == null || v.isEmpty ? 'Năm học không được để trống' : null,
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Bảng hiển thị điểm
            FutureBuilder<List<Score>>(
              future: _studentScores,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: CircularProgressIndicator(),
                  ));
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Lỗi: ${snapshot.error}'));
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
