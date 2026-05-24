import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:19
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
 * @see app/Http/Controllers/StudentGradeController.php:19
 * @route '/data-nilai-siswa'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:19
 * @route '/data-nilai-siswa'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:19
 * @route '/data-nilai-siswa'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:19
 * @route '/data-nilai-siswa'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:19
 * @route '/data-nilai-siswa'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StudentGradeController::index
 * @see app/Http/Controllers/StudentGradeController.php:19
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
* @see \App\Http\Controllers\StudentGradeController::template
 * @see app/Http/Controllers/StudentGradeController.php:125
 * @route '/data-nilai-siswa/template'
 */
export const template = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/data-nilai-siswa/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\StudentGradeController::template
 * @see app/Http/Controllers/StudentGradeController.php:125
 * @route '/data-nilai-siswa/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::template
 * @see app/Http/Controllers/StudentGradeController.php:125
 * @route '/data-nilai-siswa/template'
 */
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\StudentGradeController::template
 * @see app/Http/Controllers/StudentGradeController.php:125
 * @route '/data-nilai-siswa/template'
 */
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::template
 * @see app/Http/Controllers/StudentGradeController.php:125
 * @route '/data-nilai-siswa/template'
 */
    const templateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: template.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::template
 * @see app/Http/Controllers/StudentGradeController.php:125
 * @route '/data-nilai-siswa/template'
 */
        templateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\StudentGradeController::template
 * @see app/Http/Controllers/StudentGradeController.php:125
 * @route '/data-nilai-siswa/template'
 */
        templateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    template.form = templateForm
/**
* @see \App\Http\Controllers\StudentGradeController::store
 * @see app/Http/Controllers/StudentGradeController.php:52
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
 * @see app/Http/Controllers/StudentGradeController.php:52
 * @route '/data-nilai-siswa'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::store
 * @see app/Http/Controllers/StudentGradeController.php:52
 * @route '/data-nilai-siswa'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::store
 * @see app/Http/Controllers/StudentGradeController.php:52
 * @route '/data-nilai-siswa'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::store
 * @see app/Http/Controllers/StudentGradeController.php:52
 * @route '/data-nilai-siswa'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\StudentGradeController::importMethod
 * @see app/Http/Controllers/StudentGradeController.php:95
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
 * @see app/Http/Controllers/StudentGradeController.php:95
 * @route '/data-nilai-siswa/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\StudentGradeController::importMethod
 * @see app/Http/Controllers/StudentGradeController.php:95
 * @route '/data-nilai-siswa/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::importMethod
 * @see app/Http/Controllers/StudentGradeController.php:95
 * @route '/data-nilai-siswa/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\StudentGradeController::importMethod
 * @see app/Http/Controllers/StudentGradeController.php:95
 * @route '/data-nilai-siswa/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\StudentGradeController::update
 * @see app/Http/Controllers/StudentGradeController.php:71
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
 * @see app/Http/Controllers/StudentGradeController.php:71
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
 * @see app/Http/Controllers/StudentGradeController.php:71
 * @route '/data-nilai-siswa/{studentGrade}'
 */
update.put = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::update
 * @see app/Http/Controllers/StudentGradeController.php:71
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
 * @see app/Http/Controllers/StudentGradeController.php:71
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
 * @see app/Http/Controllers/StudentGradeController.php:88
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
 * @see app/Http/Controllers/StudentGradeController.php:88
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
 * @see app/Http/Controllers/StudentGradeController.php:88
 * @route '/data-nilai-siswa/{studentGrade}'
 */
destroy.delete = (args: { studentGrade: number | { id: number } } | [studentGrade: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\StudentGradeController::destroy
 * @see app/Http/Controllers/StudentGradeController.php:88
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
 * @see app/Http/Controllers/StudentGradeController.php:88
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
const dataNilaiSiswa = {
    index: Object.assign(index, index),
template: Object.assign(template, template),
store: Object.assign(store, store),
import: Object.assign(importMethod, importMethod),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default dataNilaiSiswa