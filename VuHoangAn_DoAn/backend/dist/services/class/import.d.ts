type RowError = {
    row: number;
    reason: string;
};
declare const ClassImportService: {
    importFromExcel(filePath: string): Promise<{
        totalRows: number;
        valid: number;
        errors: RowError[];
        upserted: number;
        matchedUpdated: number;
    }>;
};
export default ClassImportService;
//# sourceMappingURL=import.d.ts.map