import 'package:flutter/material.dart';
import '../../../models/schedule.dart';
import '../../../services/schedule_service.dart';
import '../../../services/class_service.dart';
import '../../../models/class.dart';
import 'schedule_form.dart';

class ScheduleListPage extends StatefulWidget {
  const ScheduleListPage({super.key});

  @override
  State<ScheduleListPage> createState() => _ScheduleListPageState();
}

class _ScheduleListPageState extends State<ScheduleListPage> {
  List<Schedule> _schedules = [];
  List<Class> _classes = [];
  String? _selectedClassName;
  DateTime _currentWeek = DateTime.now();
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadClasses();
  }

  Future<void> _loadClasses() async {
    try {
      final classes = await ClassService.getClasses();
      setState(() {
        _classes = classes;
        if (classes.isNotEmpty) {
          _selectedClassName = classes.first.className;
          _loadSchedules();
        }
      });
    } catch (e) {
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi tải danh sách lớp: $e')),
      );
    }
  }

  Future<void> _loadSchedules() async {
    if (_selectedClassName == null) return;
    
    setState(() => _loading = true);
    try {
      final from = _getStartOfWeek(_currentWeek);
      final to = _getEndOfWeek(_currentWeek);
      final schedules = await ScheduleService.getByClass(
        className: _selectedClassName!,
        from: from,
        to: to,
      );  
      setState(() => _schedules = schedules);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi tải TKB: $e')),
      );
    } finally {
      setState(() => _loading = false);
    }
  }

  DateTime _getStartOfWeek(DateTime date) {
    return date.subtract(Duration(days: date.weekday - 1));
  }

  DateTime _getEndOfWeek(DateTime date) {
    return _getStartOfWeek(date).add(const Duration(days: 6));
  }

  void _prevWeek() {
    setState(() => _currentWeek = _currentWeek.subtract(const Duration(days: 7)));
    _loadSchedules();
  }

  void _nextWeek() {
    setState(() => _currentWeek = _currentWeek.add(const Duration(days: 7)));
    _loadSchedules();
  }

  Future<void> _deleteSchedule(Schedule schedule) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Xác nhận xóa'),
        content: Text('Xóa lịch học "${schedule.subjectName}"?'),
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

    if (confirm == true) {
      try {
        await ScheduleService.delete(schedule.id);
        _loadSchedules();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Xóa lịch thành công')),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi xóa lịch: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final from = _getStartOfWeek(_currentWeek);
    final to = _getEndOfWeek(_currentWeek);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý TKB'),
        actions: [
          IconButton(onPressed: _prevWeek, icon: const Icon(Icons.chevron_left)),
          Center(child: Text('${from.day}/${from.month} - ${to.day}/${to.month}')),
          IconButton(onPressed: _nextWeek, icon: const Icon(Icons.chevron_right)),
        ],
      ),
      body: Column(
        children: [
          // Filter theo lớp
          Padding(
            padding: const EdgeInsets.all(16),
            child: DropdownButtonFormField<String>(
              value: _selectedClassName,
              decoration: const InputDecoration(
                labelText: 'Chọn lớp',
                border: OutlineInputBorder(),
              ),
              items: _classes.map((c) => DropdownMenuItem(
                value: c.className,
                child: Text(c.className),
              )).toList(),
              onChanged: (value) {
                setState(() => _selectedClassName = value);
                _loadSchedules();
              },
            ),
          ),
          
          // Danh sách TKB
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadSchedules,
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _schedules.length,
                      itemBuilder: (context, index) {
                        final schedule = _schedules[index];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            title: Text(schedule.subjectName),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('${schedule.startAt.hour.toString().padLeft(2, '0')}:${schedule.startAt.minute.toString().padLeft(2, '0')} - ${schedule.endAt.hour.toString().padLeft(2, '0')}:${schedule.endAt.minute.toString().padLeft(2, '0')}'),
                                if (schedule.room != null) Text('Phòng: ${schedule.room}'),
                                if (schedule.lecturer != null) Text('GV: ${schedule.lecturer}'),
                              ],
                            ),
                            trailing: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                IconButton(
                                  icon: const Icon(Icons.edit),
                                  onPressed: () async {
                                    final result = await Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => ScheduleForm(schedule: schedule),
                                      ),
                                    );
                                    if (result == true) _loadSchedules();
                                  },
                                ),
                                IconButton(
                                  icon: const Icon(Icons.delete, color: Colors.red),
                                  onPressed: () => _deleteSchedule(schedule),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ScheduleForm()),
          );
          if (result == true) _loadSchedules();
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}