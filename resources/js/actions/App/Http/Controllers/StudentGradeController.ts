import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:21
 * @route '/data-nilai-siswa'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/data-nilai-siswa',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:21
 * @route '/data-nilai-siswa'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:21
 * @route '/data-nilai-siswa'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:21
 * @route '/data-nilai-siswa'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:21
 * @route '/data-nilai-siswa'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:21
 * @route '/data-nilai-siswa'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:21
 * @route '/data-nilai-siswa'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\StudentGradeController::downloadReport
 * @see app/Http/Controllers/StudentGradeController.php:330
 * @route '/data-nilai-siswa/download-report'
 */
export const downloadReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReport.url(options),
    method: 'get',
})

downloadReport.definition = {
    methods: ["get","head"],
    url: '/data-nilai-siswa/download-report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StudentGradeController::downloadReport
 * @see app/Http/Controllers/StudentGradeController.php:330
 * @route '/data-nilai-siswa/download-report'
 */
downloadReport.url = (options?: RouteQueryOptions) => {
    return downloadReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::downloadReport
 * @see app/Http/Controllers/StudentGradeController.php:330
 * @route '/data-nilai-siswa/download-report'
 */
downloadReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StudentGradeController::downloadReport
 * @see app/Http/Controllers/StudentGradeController.php:330
 * @route '/data-nilai-siswa/download-report'
 */
downloadReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadReport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::downloadReport
 * @see app/Http/Controllers/StudentGradeController.php:330
 * @route '/data-nilai-siswa/download-report'
 */
    const downloadReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadReport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::downloadReport
 * @see app/Http/Controllers/StudentGradeController.php:330
 * @route '/data-nilai-siswa/download-report'
 */
        downloadReportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadReport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StudentGradeController::downloadReport
 * @see app/Http/Controllers/StudentGradeController.php:330
 * @route '/data-nilai-siswa/download-report'
 */
        downloadReportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadReport.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadReport.form = downloadReportForm
/**
* @see \App\Http\Controllers\StudentGradeController::downloadTemplate
 * @see app/Http/Controllers/StudentGradeController.php:169
 * @route '/data-nilai-siswa/template'
 */
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/data-nilai-siswa/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StudentGradeController::downloadTemplate
 * @see app/Http/Controllers/StudentGradeController.php:169
 * @route '/data-nilai-siswa/template'
 */
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::downloadTemplate
 * @see app/Http/Controllers/StudentGradeController.php:169
 * @route '/data-nilai-siswa/template'
 */
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StudentGradeController::downloadTemplate
 * @see app/Http/Controllers/StudentGradeController.php:169
 * @route '/data-nilai-siswa/template'
 */
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::downloadTemplate
 * @see app/Http/Controllers/StudentGradeController.php:169
 * @route '/data-nilai-siswa/template'
 */
    const downloadTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::downloadTemplate
 * @see app/Http/Controllers/StudentGradeController.php:169
 * @route '/data-nilai-siswa/template'
 */
        downloadTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StudentGradeController::downloadTemplate
 * @see app/Http/Controllers/StudentGradeController.php:169
 * @route '/data-nilai-siswa/template'
 */
        downloadTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadTemplate.form = downloadTemplateForm
/**
* @see \App\Http\Controllers\StudentGradeController::store
 * @see app/Http/Controllers/StudentGradeController.php:98
 * @route '/data-nilai-siswa'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/data-nilai-siswa',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StudentGradeController::store
 * @see app/Http/Controllers/StudentGradeController.php:98
 * @route '/data-nilai-siswa'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::store
 * @see app/Http/Controllers/StudentGradeController.php:98
 * @route '/data-nilai-siswa'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::store
 * @see app/Http/Controllers/StudentGradeController.php:98
 * @route '/data-nilai-siswa'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::store
 * @see app/Http/Controllers/StudentGradeController.php:98
 * @route '/data-nilai-siswa'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\StudentGradeController::importMethod
 * @see app/Http/Controllers/StudentGradeController.php:141
 * @route '/data-nilai-siswa/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/data-nilai-siswa/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StudentGradeController::importMethod
 * @see app/Http/Controllers/StudentGradeController.php:141
 * @route '/data-nilai-siswa/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::importMethod
 * @see app/Http/Controllers/StudentGradeController.php:141
 * @route '/data-nilai-siswa/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::importMethod
 * @see app/Http/Controllers/StudentGradeController.php:141
 * @route '/data-nilai-siswa/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::importMethod
 * @see app/Http/Controllers/StudentGradeController.php:141
 * @route '/data-nilai-siswa/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\StudentGradeController::update
 * @see app/Http/Controllers/StudentGradeController.php:117
 * @route '/data-nilai-siswa/{studentGrade}'
 */
export const update = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/data-nilai-siswa/{studentGrade}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StudentGradeController::update
 * @see app/Http/Controllers/StudentGradeController.php:117
 * @route '/data-nilai-siswa/{studentGrade}'
 */
update.url = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentGrade: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { studentGrade: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    studentGrade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentGrade: typeof args.studentGrade === 'object'
                ? args.studentGrade.id
                : args.studentGrade,
                }

    return update.definition.url
            .replace('{studentGrade}', parsedArgs.studentGrade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::update
 * @see app/Http/Controllers/StudentGradeController.php:117
 * @route '/data-nilai-siswa/{studentGrade}'
 */
update.put = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::update
 * @see app/Http/Controllers/StudentGradeController.php:117
 * @route '/data-nilai-siswa/{studentGrade}'
 */
    const updateForm = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::update
 * @see app/Http/Controllers/StudentGradeController.php:117
 * @route '/data-nilai-siswa/{studentGrade}'
 */
        updateForm.put = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\StudentGradeController::destroy
 * @see app/Http/Controllers/StudentGradeController.php:134
 * @route '/data-nilai-siswa/{studentGrade}'
 */
export const destroy = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/data-nilai-siswa/{studentGrade}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\StudentGradeController::destroy
 * @see app/Http/Controllers/StudentGradeController.php:134
 * @route '/data-nilai-siswa/{studentGrade}'
 */
destroy.url = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { studentGrade: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { studentGrade: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    studentGrade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        studentGrade: typeof args.studentGrade === 'object'
                ? args.studentGrade.id
                : args.studentGrade,
                }

    return destroy.definition.url
            .replace('{studentGrade}', parsedArgs.studentGrade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::destroy
 * @see app/Http/Controllers/StudentGradeController.php:134
 * @route '/data-nilai-siswa/{studentGrade}'
 */
destroy.delete = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::destroy
 * @see app/Http/Controllers/StudentGradeController.php:134
 * @route '/data-nilai-siswa/{studentGrade}'
 */
    const destroyForm = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::destroy
 * @see app/Http/Controllers/StudentGradeController.php:134
 * @route '/data-nilai-siswa/{studentGrade}'
 */
        destroyForm.delete = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const StudentGradeController = { index, downloadReport, downloadTemplate, store, importMethod, update, destroy, import: importMethod }

export default StudentGradeController