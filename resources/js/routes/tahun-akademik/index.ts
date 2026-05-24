import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:11
 * @route '/tahun-akademik'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tahun-akademik',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:11
 * @route '/tahun-akademik'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:11
 * @route '/tahun-akademik'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:11
 * @route '/tahun-akademik'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:11
 * @route '/tahun-akademik'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:11
 * @route '/tahun-akademik'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:11
 * @route '/tahun-akademik'
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
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:29
 * @route '/tahun-akademik'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tahun-akademik',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:29
 * @route '/tahun-akademik'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:29
 * @route '/tahun-akademik'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:29
 * @route '/tahun-akademik'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:29
 * @route '/tahun-akademik'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:48
 * @route '/tahun-akademik/{tahun_akademik}'
 */
export const update = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/tahun-akademik/{tahun_akademik}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:48
 * @route '/tahun-akademik/{tahun_akademik}'
 */
update.url = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tahun_akademik: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tahun_akademik: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tahun_akademik: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tahun_akademik: typeof args.tahun_akademik === 'object'
                ? args.tahun_akademik.id
                : args.tahun_akademik,
                }

    return update.definition.url
            .replace('{tahun_akademik}', parsedArgs.tahun_akademik.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:48
 * @route '/tahun-akademik/{tahun_akademik}'
 */
update.put = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:48
 * @route '/tahun-akademik/{tahun_akademik}'
 */
    const updateForm = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:48
 * @route '/tahun-akademik/{tahun_akademik}'
 */
        updateForm.put = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:67
 * @route '/tahun-akademik/{tahun_akademik}'
 */
export const destroy = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/tahun-akademik/{tahun_akademik}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:67
 * @route '/tahun-akademik/{tahun_akademik}'
 */
destroy.url = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tahun_akademik: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tahun_akademik: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tahun_akademik: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tahun_akademik: typeof args.tahun_akademik === 'object'
                ? args.tahun_akademik.id
                : args.tahun_akademik,
                }

    return destroy.definition.url
            .replace('{tahun_akademik}', parsedArgs.tahun_akademik.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:67
 * @route '/tahun-akademik/{tahun_akademik}'
 */
destroy.delete = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:67
 * @route '/tahun-akademik/{tahun_akademik}'
 */
    const destroyForm = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:67
 * @route '/tahun-akademik/{tahun_akademik}'
 */
        destroyForm.delete = (args: { tahun_akademik: number | { id: number } } | [tahun_akademik: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const tahunAkademik = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default tahunAkademik