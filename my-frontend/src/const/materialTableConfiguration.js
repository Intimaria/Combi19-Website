import { ExportCsv, ExportPdf } from '@material-table/exporters';

export const materialTableConfiguration = {
    options: {
        actionsColumnIndex: -1,
        exportButton: true,
        exportAllData: true,
        filtering: true,
        exportMenu: [{
            label: 'Exportar PDF',
            exportFunc: (cols, datas) => ExportPdf(cols, datas, 'Reporte PDF')
        }, {
            label: 'Exportar CSV',
            exportFunc: (cols, datas) => ExportCsv(cols, datas, 'Reporte CSV')
        }]
        /*
        headerStyle: {
            backgroundColor: '#3f51b5',
            color: '#FFF'
        }
        */
    },
    localization: {
        toolbar: {
            searchTooltip: 'Buscar',
            searchPlaceholder: 'Buscar',
            exportTitle: 'Exportar',
            exportAriaLabel: 'Exportar',
            exportCSVName: 'Exportar como CSV',
            exportPDFName: 'Exportar como PDF',
        },
        header: {
            actions: "Acciones"
        },
        body: {
            emptyDataSourceMessage: 'Sin registros para mostrar',
            filterRow: {
                filterTooltip: `Buscar`
            },
            editRow: {
                saveTooltip: 'Guardar',
                cancelTooltip: 'Cancelar'
            }
        },
        pagination: {
            labelDisplayedRows: '{from}-{to} de {count}',
            labelRowsSelect: 'filas',
            firstAriaLabel: 'Primera página',
            firstTooltip: 'Primera página',
            previousAriaLabel: 'Página anterior',
            previousTooltip: 'Página anterior',
            nextAriaLabel: 'Página siguiente',
            nextTooltip: 'Página siguiente',
            lastAriaLabel: 'Últma página',
            lastTooltip: 'Última página',
        },
    }
}
