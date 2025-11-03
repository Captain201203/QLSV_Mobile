import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/schedule.dart';
import '../../services/schedule_service.dart';
import '../../widgets/bottom_nav.dart';

class StudyInfoScreen extends StatefulWidget {
  final String? className;
  const StudyInfoScreen({super.key, this.className});

  @override
  State<StudyInfoScreen> createState() => _StudyInfoScreenState();
}

DateTime _startOfWeek(DateTime d) => d.subtract(Duration(days: d.weekday - 1));
DateTime _endOfWeek(DateTime d) => _startOfWeek(d).add(const Duration(days: 6));

class _StudyInfoScreenState extends State<StudyInfoScreen> {
  DateTime _currentWeek = _startOfWeek(DateTime.now());
  bool _loading = true;
  List<Schedule> _schedules = [];
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    setState(() => _loading = true);
    try {
      _errorMessage = null;
      final from = _startOfWeek(_currentWeek);
      final to = _endOfWeek(_currentWeek);

      // Determine className: prefer widget, otherwise try SharedPreferences
      var cls = widget.className ?? '';
      if (cls.trim().isEmpty) {
        final prefs = await SharedPreferences.getInstance();
        cls = prefs.getString('className') ?? '';
      }

      final data = await ScheduleService.getByClass(
        className: cls,
        from: from,
        to: to,
      );
      setState(() => _schedules = data);
    } catch (e) {
      setState(() => _errorMessage = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  void _prevWeek() {
    setState(
      () => _currentWeek = _currentWeek.subtract(const Duration(days: 7)),
    );
    _fetch();
  }

  void _nextWeek() {
    setState(() => _currentWeek = _currentWeek.add(const Duration(days: 7)));
    _fetch();
  }

  @override
  Widget build(BuildContext context) {
    final from = _startOfWeek(_currentWeek);
    final to = _endOfWeek(_currentWeek);

    // Nhóm theo ngày (yyyy-mm-dd)
    final Map<String, List<Schedule>> byDate = {};
    for (final s in _schedules) {
      final d = DateTime(s.startAt.year, s.startAt.month, s.startAt.day);
      final key =
          '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
      byDate.putIfAbsent(key, () => []).add(s);
    }

    String _formatDayLabel(DateTime d) {
      const names = [
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7',
        'Chủ nhật',
      ];
      final idx = d.weekday == DateTime.sunday ? 6 : d.weekday - 1;
      return '${names[idx]}, ${d.day}/${d.month}/${d.year}';
    }

    String _formatTimeRange(BuildContext ctx, Schedule s) {
      final st = TimeOfDay.fromDateTime(s.startAt).format(ctx);
      final en = TimeOfDay.fromDateTime(s.endAt).format(ctx);
      return '$st - $en';
    }

    // Tạo danh sách ngày trong tuần và chỉ giữ ngày có môn
    final List<DateTime> days = List.generate(
      7,
      (i) => from.add(Duration(days: i)),
    );
    final items = <Widget>[];
    for (final day in days) {
      final key =
          '${day.year}-${day.month.toString().padLeft(2, '0')}-${day.day.toString().padLeft(2, '0')}';
      final list = byDate[key] ?? [];
      if (list.isEmpty) continue; // Bỏ ngày không có lịch

      list.sort((a, b) => a.startAt.compareTo(b.startAt));

      // Ghép thông tin theo format giống schedule_exam
      for (final s in list) {
        final dayLabel = _formatDayLabel(day); // VD: 'Thứ 4, 16/10/2025'
        final timeStr = _formatTimeRange(context, s); // VD: '07:00 - 09:00'
        items.add(
          Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  blurRadius: 4,
                  spreadRadius: 1,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  dayLabel,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  s.subjectName,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '$timeStr  •  ${s.room ?? "-"}',
                  style: const TextStyle(fontSize: 14, color: Colors.black54),
                ),
                if (s.lecturer != null && s.lecturer!.isNotEmpty)
                  Align(
                    alignment: Alignment.centerRight,
                    child: Text(
                      s.lecturer!,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.black54,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        );
      }
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7F7),
      bottomNavigationBar: const BottomNavBar(currentIndex: 1),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Thời khóa biểu • ${widget.className ?? ''}',
          style: const TextStyle(
            color: Colors.black,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: false,
        actions: [
          IconButton(
            onPressed: _prevWeek,
            icon: const Icon(Icons.chevron_left, color: Colors.black87),
          ),
          Center(
            child: Text(
              '${from.day}/${from.month} - ${to.day}/${to.month}',
              style: const TextStyle(
                color: Colors.black87,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          IconButton(
            onPressed: _nextWeek,
            icon: const Icon(Icons.chevron_right, color: Colors.black87),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _fetch,
              child: ListView(
                padding: const EdgeInsets.all(10),
                children: [
                  if (_errorMessage != null)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Card(
                        color: Colors.red.shade50,
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Text(
                            'Lỗi tải lịch: $_errorMessage',
                            style: const TextStyle(color: Colors.red),
                          ),
                        ),
                      ),
                    ),
                  if (items.isEmpty)
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.all(24),
                        child: Text('Tuần này không có lịch'),
                      ),
                    )
                  else
                    ...items,
                ],
              ),
            ),
    );
  }
}
