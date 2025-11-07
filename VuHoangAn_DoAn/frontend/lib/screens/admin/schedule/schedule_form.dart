import 'package:flutter/material.dart';
import '../../../models/schedule.dart';
import '../../../models/subject.dart';
import '../../../models/class.dart';
import '../../../services/schedule_service.dart';
import '../../../services/subject_service.dart';
import '../../../services/class_service.dart';

class ScheduleForm extends StatefulWidget {
  final Schedule? schedule; // null = tạo mới, có = sửa
  const ScheduleForm({super.key, this.schedule});

  @override
  State<ScheduleForm> createState() => _ScheduleFormState();
}

class _ScheduleFormState extends State<ScheduleForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _lecturerController = TextEditingController();
  final TextEditingController _roomController = TextEditingController();
  final TextEditingController _noteController = TextEditingController();

  String? _selectedClassName;
  String? _selectedSubjectId;
  DateTime? _selectedDate;
  TimeOfDay? _startTime;
  TimeOfDay? _endTime;

  List<Class> _classes = [];
  List<Subject> _subjects = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
    if (widget.schedule != null) {
      _loadExistingData();
    }
  }

  Future<void> _loadData() async {
    try {
      final classes = await ClassService.getClasses();
      final subjects = await SubjectService.getSubjects();
      setState(() {
        _classes = classes;
        _subjects = subjects;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi tải dữ liệu: $e')),
      );
    }
  }

  void _loadExistingData() {
    final s = widget.schedule!;
    _selectedClassName = s.className;
    _selectedSubjectId = s.subjectId;
    _selectedDate = s.startAt;
    _startTime = TimeOfDay.fromDateTime(s.startAt);
    _endTime = TimeOfDay.fromDateTime(s.endAt);
    _lecturerController.text = s.lecturer ?? '';
    _roomController.text = s.room ?? '';
    _noteController.text = s.note ?? '';
  }

  @override
  void dispose() {
    _lecturerController.dispose();
    _roomController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _selectDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 30)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date != null) {
      setState(() => _selectedDate = date);
    }
  }

  Future<void> _selectTime(bool isStart) async {
    final time = await showTimePicker(
      context: context,
      initialTime: isStart ? (_startTime ?? const TimeOfDay(hour: 8, minute: 0))
                          : (_endTime ?? const TimeOfDay(hour: 10, minute: 0)),
    );
    if (time != null) {
      setState(() {
        if (isStart) {
          _startTime = time;
        } else {
          _endTime = time;
        }
      });
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedClassName == null || _selectedSubjectId == null || 
        _selectedDate == null || _startTime == null || _endTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng điền đầy đủ thông tin')),
      );
      return;
    }

    try {
      final startAt = DateTime(
        _selectedDate!.year,
        _selectedDate!.month,
        _selectedDate!.day,
        _startTime!.hour,
        _startTime!.minute,
      );
      final endAt = DateTime(
        _selectedDate!.year,
        _selectedDate!.month,
        _selectedDate!.day,
        _endTime!.hour,
        _endTime!.minute,
      );

      final payload = { // payload là dữ liệu gửi đi từ client đến server
        'className': _selectedClassName,
        'subjectId': _selectedSubjectId,
        'subjectName': _subjects.firstWhere((s) => s.subjectId == _selectedSubjectId).subjectName,
        'startAt': startAt.toIso8601String(),
        'endAt': endAt.toIso8601String(),
        'lecturer': _lecturerController.text.trim().isEmpty ? null : _lecturerController.text.trim(),
        'room': _roomController.text.trim().isEmpty ? null : _roomController.text.trim(),
        'note': _noteController.text.trim().isEmpty ? null : _noteController.text.trim(),
      };

      if (widget.schedule == null) { // nếu không có schedule thì tạo mới
        await ScheduleService.create(payload);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Tạo lịch thành công')),
        );
      } else {
        await ScheduleService.update(widget.schedule!.id, payload); // cập nhật schedule
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cập nhật lịch thành công')),
        );
      }
      Navigator.pop(context, true);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.schedule == null ? 'Tạo lịch học' : 'Sửa lịch học'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Chọn lớp
                    const Text('Lớp học', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: _selectedClassName,
                      decoration: const InputDecoration(border: OutlineInputBorder()),
                      items: _classes.map((c) => DropdownMenuItem(
                        value: c.className,
                        child: Text(c.className),
                      )).toList(),
                      onChanged: (value) => setState(() => _selectedClassName = value),
                      validator: (value) => value == null ? 'Chọn lớp' : null,
                    ),
                    const SizedBox(height: 16),

                    // Chọn môn học
                    const Text('Môn học', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: _selectedSubjectId,
                      decoration: const InputDecoration(border: OutlineInputBorder()),
                      items: _subjects.map((s) => DropdownMenuItem(
                        value: s.subjectId,
                        child: Text('${s.subjectId} - ${s.subjectName}'),
                      )).toList(),
                      onChanged: (value) => setState(() => _selectedSubjectId = value),
                      validator: (value) => value == null ? 'Chọn môn học' : null,
                    ),
                    const SizedBox(height: 16),

                    // Chọn ngày
                    const Text('Ngày học', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: _selectDate,
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.calendar_today),
                            const SizedBox(width: 8),
                            Text(_selectedDate == null 
                                ? 'Chọn ngày' 
                                : '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Chọn giờ bắt đầu
                    const Text('Giờ bắt đầu', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: () => _selectTime(true),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.access_time),
                            const SizedBox(width: 8),
                            Text(_startTime == null 
                                ? 'Chọn giờ bắt đầu' 
                                : _startTime!.format(context)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Chọn giờ kết thúc
                    const Text('Giờ kết thúc', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: () => _selectTime(false),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.access_time),
                            const SizedBox(width: 8),
                            Text(_endTime == null 
                                ? 'Chọn giờ kết thúc' 
                                : _endTime!.format(context)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Phòng học
                    TextFormField(
                      controller: _roomController,
                      decoration: const InputDecoration(
                        labelText: 'Phòng học',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Giảng viên
                    TextFormField(
                      controller: _lecturerController,
                      decoration: const InputDecoration(
                        labelText: 'Giảng viên',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Ghi chú
                    TextFormField(
                      controller: _noteController,
                      decoration: const InputDecoration(
                        labelText: 'Ghi chú',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 24),

                    // Nút lưu
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _save,
                        child: Text(widget.schedule == null ? 'Tạo lịch' : 'Cập nhật'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}