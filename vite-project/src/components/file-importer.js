"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileImporter = FileImporter;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var XLSX = require("xlsx");
var papaparse_1 = require("papaparse");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var card_1 = require("@/components/ui/card");
var alert_1 = require("@/components/ui/alert");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("@/lib/firebase");
function FileImporter(_a) {
    var _this = this;
    var onDataImported = _a.onDataImported;
    var _b = (0, react_1.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)('idle'), uploadStatus = _c[0], setUploadStatus = _c[1];
    var _d = (0, react_1.useState)(''), statusMessage = _d[0], setStatusMessage = _d[1];
    var _e = (0, react_1.useState)([]), previewData = _e[0], setPreviewData = _e[1];
    var _f = (0, react_1.useState)(false), showPreview = _f[0], setShowPreview = _f[1];
    var fileInputRef = (0, react_1.useRef)(null);
    var processExcelFile = function (file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                try {
                    var data = new Uint8Array((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                    var workbook = XLSX.read(data, { type: 'array' });
                    var sheetName = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[sheetName];
                    var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    if (jsonData.length < 2) {
                        reject(new Error('El archivo debe contener al menos una fila de encabezados y una fila de datos'));
                        return;
                    }
                    // Asumiendo que la primera fila son los encabezados
                    var headers_1 = jsonData[0];
                    var rows = jsonData.slice(1);
                    var processedData = rows
                        .filter(function (row) { return row.some(function (cell) { return cell !== null && cell !== undefined && cell !== ''; }); })
                        .map(function (row, index) {
                        var student = {};
                        // Mapear columnas basándose en posición o nombre de encabezado
                        var headerMapping = {
                            'NOMBRE ESTUDIANTE': 'nombreEstudiante',
                            'Nombre Estudiante': 'nombreEstudiante',
                            'Nombre': 'nombreEstudiante',
                            'RUT': 'rut',
                            'Rut': 'rut',
                            'CARRERA': 'carrera',
                            'Carrera': 'carrera',
                            'FACULTAD': 'facultad',
                            'Facultad': 'facultad',
                            'NOMBRE EMPRESA': 'nombreEmpresa',
                            'Nombre Empresa': 'nombreEmpresa',
                            'Empresa': 'nombreEmpresa',
                            'JEFE DIRECTO': 'jefeDirecto',
                            'Jefe Directo': 'jefeDirecto',
                            'Jefe': 'jefeDirecto',
                            'EMAIL': 'email',
                            'Email': 'email',
                            'Correo': 'email',
                            'EMAIL ESTUDIANTE': 'email',
                            'Email Estudiante': 'email',
                            'EMAIL EMPRESA': 'emailEmpresa',
                            'Email Empresa': 'emailEmpresa',
                            'Correo Empresa': 'emailEmpresa',
                            'TELEFONO EMPRESA': 'telefonoEmpresa',
                            'Telefono Empresa': 'telefonoEmpresa',
                            'Teléfono Empresa': 'telefonoEmpresa',
                            'CARGO': 'cargo',
                            'Cargo': 'cargo',
                            'COMUNA': 'comuna',
                            'Comuna': 'comuna',
                            'REGION': 'region',
                            'Región': 'region',
                            'Region': 'region',
                            'DIRECCION EMPRESA': 'direccionEmpresa',
                            'Direccion Empresa': 'direccionEmpresa',
                            'Dirección Empresa': 'direccionEmpresa',
                            'SEMESTRE': 'semestre',
                            'Semestre': 'semestre',
                            'AÑO': 'anio',
                            'Año': 'anio',
                            'FECHA INICIO': 'fechaInicio',
                            'Fecha Inicio': 'fechaInicio',
                            'FECHA TERMINO': 'fechaTermino',
                            'Fecha Termino': 'fechaTermino',
                            'Fecha Término': 'fechaTermino',
                            'HORAS PRACTICA': 'horasPractica',
                            'Horas Practica': 'horasPractica',
                            'Horas Práctica': 'horasPractica',
                            'EVALUACION ENVIADA': 'evaluacionEnviada',
                            'Evaluacion Enviada': 'evaluacionEnviada',
                            'Evaluación': 'evaluacionEnviada',
                            'SUPERVISOR': 'supervisor',
                            'Supervisor': 'supervisor',
                            'NOTA PRACTICA': 'notaPractica',
                            'Nota Practica': 'notaPractica',
                            'Nota Práctica': 'notaPractica'
                        };
                        headers_1.forEach(function (header, i) {
                            var mappedKey = headerMapping[header] || header.toLowerCase().replace(/\s+/g, '');
                            if (mappedKey && row[i] !== null && row[i] !== undefined) {
                                student[mappedKey] = String(row[i]).trim();
                            }
                        });
                        // Valores por defecto si no se encuentran en el archivo
                        return {
                            nombreEstudiante: student.nombreEstudiante || student.nombre || '',
                            rut: student.rut || '',
                            carrera: student.carrera || '',
                            facultad: student.facultad || '',
                            nombreEmpresa: student.nombreEmpresa || student.empresa || '',
                            jefeDirecto: student.jefeDirecto || student.jefe || '',
                            email: student.email || student.correo || '',
                            emailEmpresa: student.emailEmpresa || '',
                            telefonoEmpresa: student.telefonoEmpresa || '',
                            cargo: student.cargo || '',
                            comuna: student.comuna || '',
                            region: student.region || '',
                            direccionEmpresa: student.direccionEmpresa || '',
                            semestre: student.semestre || '',
                            anio: student.anio || student.año || '',
                            fechaInicio: student.fechaInicio || '',
                            fechaTermino: student.fechaTermino || '',
                            horasPractica: student.horasPractica || '',
                            evaluacionEnviada: student.evaluacionEnviada || student.evaluacion || 'No',
                            supervisor: student.supervisor || '',
                            notaPractica: student.notaPractica || ''
                        };
                    });
                    resolve(processedData);
                }
                catch (error) {
                    reject(new Error('Error al procesar el archivo Excel: ' + error.message));
                }
            };
            reader.onerror = function () { return reject(new Error('Error al leer el archivo')); };
            reader.readAsArrayBuffer(file);
        });
    };
    var processCSVFile = function (file) {
        return new Promise(function (resolve, reject) {
            papaparse_1.default.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    try {
                        var processedData = results.data.map(function (row) { return ({
                            nombreEstudiante: row['NOMBRE ESTUDIANTE'] || row['Nombre Estudiante'] || row['Nombre'] || '',
                            rut: row['RUT'] || row['Rut'] || '',
                            carrera: row['CARRERA'] || row['Carrera'] || '',
                            facultad: row['FACULTAD'] || row['Facultad'] || '',
                            nombreEmpresa: row['NOMBRE EMPRESA'] || row['Nombre Empresa'] || row['Empresa'] || '',
                            jefeDirecto: row['JEFE DIRECTO'] || row['Jefe Directo'] || row['Jefe'] || '',
                            email: row['EMAIL'] || row['Email'] || row['Correo'] || row['EMAIL ESTUDIANTE'] || row['Email Estudiante'] || '',
                            emailEmpresa: row['EMAIL EMPRESA'] || row['Email Empresa'] || row['Correo Empresa'] || '',
                            telefonoEmpresa: row['TELEFONO EMPRESA'] || row['Telefono Empresa'] || row['Teléfono Empresa'] || '',
                            cargo: row['CARGO'] || row['Cargo'] || '',
                            comuna: row['COMUNA'] || row['Comuna'] || '',
                            region: row['REGION'] || row['Región'] || row['Region'] || '',
                            direccionEmpresa: row['DIRECCION EMPRESA'] || row['Direccion Empresa'] || row['Dirección Empresa'] || '',
                            semestre: row['SEMESTRE'] || row['Semestre'] || '',
                            anio: row['AÑO'] || row['Año'] || '',
                            fechaInicio: row['FECHA INICIO'] || row['Fecha Inicio'] || '',
                            fechaTermino: row['FECHA TERMINO'] || row['Fecha Termino'] || row['Fecha Término'] || '',
                            horasPractica: row['HORAS PRACTICA'] || row['Horas Practica'] || row['Horas Práctica'] || '',
                            evaluacionEnviada: row['EVALUACION ENVIADA'] || row['Evaluacion Enviada'] || row['Evaluación'] || 'No',
                            supervisor: row['SUPERVISOR'] || row['Supervisor'] || '',
                            notaPractica: row['NOTA PRACTICA'] || row['Nota Practica'] || row['Nota Práctica'] || ''
                        }); });
                        resolve(processedData);
                    }
                    catch (error) {
                        reject(new Error('Error al procesar el archivo CSV: ' + error.message));
                    }
                },
                error: function (error) {
                    reject(new Error('Error al parsear CSV: ' + error.message));
                }
            });
        });
    };
    var syncToFirebase = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var querySnapshot, deletePromises, addPromises, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, 'estudiantes'))];
                case 1:
                    querySnapshot = _a.sent();
                    deletePromises = querySnapshot.docs.map(function (doc) { return (0, firestore_1.deleteDoc)(doc.ref); });
                    return [4 /*yield*/, Promise.all(deletePromises)];
                case 2:
                    _a.sent();
                    addPromises = data.map(function (student, index) { return __awaiter(_this, void 0, void 0, function () {
                        var docRef;
                        return __generator(this, function (_a) {
                            docRef = (0, firestore_1.doc)(firebase_1.db, 'estudiantes', "estudiante_".concat(index + 1));
                            return [2 /*return*/, (0, firestore_1.setDoc)(docRef, __assign(__assign({}, student), { fechaImportacion: new Date().toISOString(), id: "estudiante_".concat(index + 1) }))];
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(addPromises)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, true];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error al sincronizar con Firebase:', error_1);
                    throw new Error('Error al sincronizar con Firebase: ' + error_1.message);
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleFileUpload = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var file, data, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    setIsLoading(true);
                    setUploadStatus('idle');
                    setStatusMessage('');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    data = void 0;
                    if (!(file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) return [3 /*break*/, 3];
                    return [4 /*yield*/, processExcelFile(file)];
                case 2:
                    data = _b.sent();
                    return [3 /*break*/, 6];
                case 3:
                    if (!file.name.endsWith('.csv')) return [3 /*break*/, 5];
                    return [4 /*yield*/, processCSVFile(file)];
                case 4:
                    data = _b.sent();
                    return [3 /*break*/, 6];
                case 5: throw new Error('Formato de archivo no soportado. Use archivos .xlsx, .xls o .csv');
                case 6:
                    if (data.length === 0) {
                        throw new Error('No se encontraron datos válidos en el archivo');
                    }
                    setPreviewData(data);
                    setShowPreview(true);
                    setStatusMessage("Se procesaron ".concat(data.length, " registros correctamente"));
                    return [3 /*break*/, 9];
                case 7:
                    error_2 = _b.sent();
                    setUploadStatus('error');
                    setStatusMessage(error_2.message);
                    return [3 /*break*/, 9];
                case 8:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var confirmImport = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (previewData.length === 0)
                        return [2 /*return*/];
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, syncToFirebase(previewData)];
                case 2:
                    _a.sent();
                    onDataImported(previewData);
                    setUploadStatus('success');
                    setStatusMessage("Se importaron ".concat(previewData.length, " registros exitosamente a Firebase"));
                    setShowPreview(false);
                    setPreviewData([]);
                    // Limpiar el input file
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    setUploadStatus('error');
                    setStatusMessage(error_3.message);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var cancelImport = function () {
        setShowPreview(false);
        setPreviewData([]);
        setStatusMessage('');
        setUploadStatus('idle');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-5 w-5" }), "Importar Datos de Estudiantes"] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Sube un archivo Excel (.xlsx, .xls) o CSV con los datos de los estudiantes. Los datos se sincronizar\u00E1n autom\u00E1ticamente con Firebase." })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)(input_1.Input, { ref: fileInputRef, type: "file", accept: ".xlsx,.xls,.csv", onChange: handleFileUpload, disabled: isLoading, className: "file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 flex-shrink-0", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileSpreadsheet, { className: "h-3 w-3 mr-1" }), "Excel"] }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "outline", className: "text-xs", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-3 w-3 mr-1" }), "CSV"] })] })] }), isLoading && ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: "Procesando archivo, por favor espere..." })] })), uploadStatus === 'success' && ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { className: "border-green-200 bg-green-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" }), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { className: "text-green-800", children: statusMessage })] })), uploadStatus === 'error' && ((0, jsx_runtime_1.jsxs)(alert_1.Alert, { className: "border-red-200 bg-red-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4 text-red-600" }), (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { className: "text-red-800", children: statusMessage })] })), showPreview && ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border-blue-200 bg-blue-50", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-lg", children: "Vista Previa de Datos" }), (0, jsx_runtime_1.jsxs)(card_1.CardDescription, { children: ["Se encontraron ", previewData.length, " registros. Revisa los datos antes de importar."] })] }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "max-h-60 overflow-y-auto border rounded-md bg-white", children: [(0, jsx_runtime_1.jsxs)("table", { className: "min-w-full text-sm", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50 sticky top-0", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-2 py-1 text-left", children: "Nombre" }), (0, jsx_runtime_1.jsx)("th", { className: "px-2 py-1 text-left", children: "RUT" }), (0, jsx_runtime_1.jsx)("th", { className: "px-2 py-1 text-left", children: "Carrera" }), (0, jsx_runtime_1.jsx)("th", { className: "px-2 py-1 text-left", children: "Facultad" }), (0, jsx_runtime_1.jsx)("th", { className: "px-2 py-1 text-left", children: "Empresa" }), (0, jsx_runtime_1.jsx)("th", { className: "px-2 py-1 text-left", children: "Comuna" }), (0, jsx_runtime_1.jsx)("th", { className: "px-2 py-1 text-left", children: "Email" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: previewData.slice(0, 10).map(function (student, index) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-2 py-1", children: student.nombreEstudiante }), (0, jsx_runtime_1.jsx)("td", { className: "px-2 py-1", children: student.rut }), (0, jsx_runtime_1.jsx)("td", { className: "px-2 py-1", children: student.carrera }), (0, jsx_runtime_1.jsx)("td", { className: "px-2 py-1", children: student.facultad }), (0, jsx_runtime_1.jsx)("td", { className: "px-2 py-1", children: student.nombreEmpresa }), (0, jsx_runtime_1.jsx)("td", { className: "px-2 py-1", children: student.comuna }), (0, jsx_runtime_1.jsx)("td", { className: "px-2 py-1", children: student.email })] }, index)); }) })] }), previewData.length > 10 && ((0, jsx_runtime_1.jsxs)("div", { className: "p-2 text-center text-gray-500", children: ["... y ", previewData.length - 10, " registros m\u00E1s"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-2 mt-4", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: confirmImport, disabled: isLoading, className: "bg-green-600 hover:bg-green-700 flex-1 sm:flex-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 mr-2" }), "Confirmar Importaci\u00F3n"] }), (0, jsx_runtime_1.jsxs)(button_1.Button, { variant: "outline", onClick: cancelImport, disabled: isLoading, className: "flex-1 sm:flex-none", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4 mr-2" }), "Cancelar"] })] })] })] }))] })] }) }));
}
