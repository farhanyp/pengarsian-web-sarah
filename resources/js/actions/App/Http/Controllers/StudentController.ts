import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\StudentController::index
 * @see app/Http/Controllers/StudentController.php:19
 * @route '/data-siswa'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/data-siswa',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StudentController::index
 * @see app/Http/Controllers/StudentController.php:19
 * @route '/data-siswa'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentController::index
 * @see app/Http/Controllers/StudentController.php:19
 * @route '/data-siswa'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StudentController::index
 * @see app/Http/Controllers/StudentController.php:19
 * @route '/data-siswa'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StudentController::index
 * @see app/Http/Controllers/StudentController.php:19
 * @route '/data-siswa'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StudentController::index
 * @see app/Http/Controllers/StudentController.php:19
 * @route '/data-siswa'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StudentController::index
 * @see app/Http/Controllers/StudentController.php:19
 * @route '/data-siswa'
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
* @see \App\Http\Controllers\StudentController::downloadReport
 * @see app/Http/Controllers/StudentController.php:116
 * @route '/data-siswa/download-report'
 */
export const downloadReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReport.url(options),
    method: 'get',
})

downloadReport.definition = {
    methods: ["get","head"],
    url: '/data-siswa/download-report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StudentController::downloadReport
 * @see app/Http/Controllers/StudentController.php:116
 * @route '/data-siswa/download-report'
 */
downloadReport.url = (options?: RouteQueryOptions) => {
    return downloadReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentController::downloadReport
 * @see app/Http/Controllers/StudentController.php:116
 * @route '/data-siswa/download-report'
 */
downloadReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadReport.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StudentController::downloadReport
 * @see app/Http/Controllers/StudentController.php:116
 * @route '/data-siswa/download-report'
 */
downloadReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadReport.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StudentController::downloadReport
 * @see app/Http/Controllers/StudentController.php:116
 * @route '/data-siswa/download-report'
 */
    const downloadReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadReport.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StudentController::downloadReport
 * @see app/Http/Controllers/StudentController.php:116
 * @route '/data-siswa/download-report'
 */
        downloadReportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadReport.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StudentController::downloadReport
 * @see app/Http/Controllers/StudentController.php:116
 * @route '/data-siswa/download-report'
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
* @see \App\Http\Controllers\StudentController::downloadTemplate
 * @see app/Http/Controllers/StudentController.php:128
 * @route '/data-siswa/template'
 */
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/data-siswa/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StudentController::downloadTemplate
 * @see app/Http/Controllers/StudentController.php:128
 * @route '/data-siswa/template'
 */
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentController::downloadTemplate
 * @see app/Http/Controllers/StudentController.php:128
 * @route '/data-siswa/template'
 */
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StudentController::downloadTemplate
 * @see app/Http/Controllers/StudentController.php:128
 * @route '/data-siswa/template'
 */
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StudentController::downloadTemplate
 * @see app/Http/Controllers/StudentController.php:128
 * @route '/data-siswa/template'
 */
    const downloadTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StudentController::downloadTemplate
 * @see app/Http/Controllers/StudentController.php:128
 * @route '/data-siswa/template'
 */
        downloadTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StudentController::downloadTemplate
 * @see app/Http/Controllers/StudentController.php:128
 * @route '/data-siswa/template'
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
* @see \App\Http\Controllers\StudentController::importBatch
 * @see app/Http/Controllers/StudentController.php:206
 * @route '/data-siswa/import'
 */
export const importBatch = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importBatch.url(options),
    method: 'post',
})

importBatch.definition = {
    methods: ["post"],
    url: '/data-siswa/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StudentController::importBatch
 * @see app/Http/Controllers/StudentController.php:206
 * @route '/data-siswa/import'
 */
importBatch.url = (options?: RouteQueryOptions) => {
    return importBatch.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentController::importBatch
 * @see app/Http/Controllers/StudentController.php:206
 * @route '/data-siswa/import'
 */
importBatch.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importBatch.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StudentController::importBatch
 * @see app/Http/Controllers/StudentController.php:206
 * @route '/data-siswa/import'
 */
    const importBatchForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importBatch.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentController::importBatch
 * @see app/Http/Controllers/StudentController.php:206
 * @route '/data-siswa/import'
 */
        importBatchForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importBatch.url(options),
            method: 'post',
        })
    
    importBatch.form = importBatchForm
/**
* @see \App\Http\Controllers\StudentController::store
 * @see app/Http/Controllers/StudentController.php:70
 * @route '/data-siswa'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/data-siswa',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\StudentController::store
 * @see app/Http/Controllers/StudentController.php:70
 * @route '/data-siswa'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentController::store
 * @see app/Http/Controllers/StudentController.php:70
 * @route '/data-siswa'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StudentController::store
 * @see app/Http/Controllers/StudentController.php:70
 * @route '/data-siswa'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentController::store
 * @see app/Http/Controllers/StudentController.php:70
 * @route '/data-siswa'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\StudentController::update
 * @see app/Http/Controllers/StudentController.php:95
 * @route '/data-siswa/{student}'
 */
export const update = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/data-siswa/{student}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\StudentController::update
 * @see app/Http/Controllers/StudentController.php:95
 * @route '/data-siswa/{student}'
 */
update.url = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { student: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    student: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student: typeof args.student === 'object'
                ? args.student.id
                : args.student,
                }

    return update.definition.url
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentController::update
 * @see app/Http/Controllers/StudentController.php:95
 * @route '/data-siswa/{student}'
 */
update.put = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\StudentController::update
 * @see app/Http/Controllers/StudentController.php:95
 * @route '/data-siswa/{student}'
 */
    const updateForm = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentController::update
 * @see app/Http/Controllers/StudentController.php:95
 * @route '/data-siswa/{student}'
 */
        updateForm.put = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\StudentController::destroy
 * @see app/Http/Controllers/StudentController.php:109
 * @route '/data-siswa/{student}'
 */
export const destroy = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/data-siswa/{student}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\StudentController::destroy
 * @see app/Http/Controllers/StudentController.php:109
 * @route '/data-siswa/{student}'
 */
destroy.url = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { student: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { student: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    student: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        student: typeof args.student === 'object'
                ? args.student.id
                : args.student,
                }

    return destroy.definition.url
            .replace('{student}', parsedArgs.student.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentController::destroy
 * @see app/Http/Controllers/StudentController.php:109
 * @route '/data-siswa/{student}'
 */
destroy.delete = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\StudentController::destroy
 * @see app/Http/Controllers/StudentController.php:109
 * @route '/data-siswa/{student}'
 */
    const destroyForm = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentController::destroy
 * @see app/Http/Controllers/StudentController.php:109
 * @route '/data-siswa/{student}'
 */
        destroyForm.delete = (args: { student: string | { id: string } } | [student: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const StudentController = { index, downloadReport, downloadTemplate, importBatch, store, update, destroy }

export default StudentController