type RowError = {
    row: number;
    reason: string;
};
declare const SubjectImportService: {
    importFromExcel(filePath: string): Promise<{
        totalRows: number;
        valid: number;
        errors: RowError[];
        upserted: number;
        matchedUpdated: number;
    }>;
};
export default SubjectImportService;
//# sourceMappingURL=import.d.ts.map