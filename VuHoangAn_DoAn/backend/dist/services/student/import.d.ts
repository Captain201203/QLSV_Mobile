type RowError = {
    row: number;
    reason: string;
};
declare const StudentImportService: {
    importFromExcel(filePath: string): Promise<{
        totalRows: number;
        valid: number;
        skippedByClass: number;
        errors: RowError[];
        upserted: number;
        matchedUpdated: number;
    }>;
};
export default StudentImportService;
//# sourceMappingURL=import.d.ts.map