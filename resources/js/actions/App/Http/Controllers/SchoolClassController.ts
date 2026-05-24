import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SchoolClassController::index
 * @see app/Http/Controllers/SchoolClassController.php:11
 * @route '/kelas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kelas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SchoolClassController::index
 * @see app/Http/Controllers/SchoolClassController.php:11
 * @route '/kelas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SchoolClassController::index
 * @see app/Http/Controllers/SchoolClassController.php:11
 * @route '/kelas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SchoolClassController::index
 * @see app/Http/Controllers/SchoolClassController.php:11
 * @route '/kelas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SchoolClassController::index
 * @see app/Http/Controllers/SchoolClassController.php:11
 * @route '/kelas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SchoolClassController::index
 * @see app/Http/Controllers/SchoolClassController.php:11
 * @route '/kelas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SchoolClassController::index
 * @see app/Http/Controllers/SchoolClassController.php:11
 * @route '/kelas'
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
* @see \App\Http\Controllers\SchoolClassController::store
 * @see app/Http/Controllers/SchoolClassController.php:29
 * @route '/kelas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kelas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SchoolClassController::store
 * @see app/Http/Controllers/SchoolClassController.php:29
 * @route '/kelas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SchoolClassController::store
 * @see app/Http/Controllers/SchoolClassController.php:29
 * @route '/kelas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SchoolClassController::store
 * @see app/Http/Controllers/SchoolClassController.php:29
 * @route '/kelas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SchoolClassController::store
 * @see app/Http/Controllers/SchoolClassController.php:29
 * @route '/kelas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\SchoolClassController::update
 * @see app/Http/Controllers/SchoolClassController.php:40
 * @route '/kelas/{schoolClass}'
 */
export const update = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/kelas/{schoolClass}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SchoolClassController::update
 * @see app/Http/Controllers/SchoolClassController.php:40
 * @route '/kelas/{schoolClass}'
 */
update.url = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schoolClass: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { schoolClass: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    schoolClass: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        schoolClass: typeof args.schoolClass === 'object'
                ? args.schoolClass.id
                : args.schoolClass,
                }

    return update.definition.url
            .replace('{schoolClass}', parsedArgs.schoolClass.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SchoolClassController::update
 * @see app/Http/Controllers/SchoolClassController.php:40
 * @route '/kelas/{schoolClass}'
 */
update.put = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\SchoolClassController::update
 * @see app/Http/Controllers/SchoolClassController.php:40
 * @route '/kelas/{schoolClass}'
 */
    const updateForm = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SchoolClassController::update
 * @see app/Http/Controllers/SchoolClassController.php:40
 * @route '/kelas/{schoolClass}'
 */
        updateForm.put = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SchoolClassController::destroy
 * @see app/Http/Controllers/SchoolClassController.php:51
 * @route '/kelas/{schoolClass}'
 */
export const destroy = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/kelas/{schoolClass}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SchoolClassController::destroy
 * @see app/Http/Controllers/SchoolClassController.php:51
 * @route '/kelas/{schoolClass}'
 */
destroy.url = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { schoolClass: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { schoolClass: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    schoolClass: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        schoolClass: typeof args.schoolClass === 'object'
                ? args.schoolClass.id
                : args.schoolClass,
                }

    return destroy.definition.url
            .replace('{schoolClass}', parsedArgs.schoolClass.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SchoolClassController::destroy
 * @see app/Http/Controllers/SchoolClassController.php:51
 * @route '/kelas/{schoolClass}'
 */
destroy.delete = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SchoolClassController::destroy
 * @see app/Http/Controllers/SchoolClassController.php:51
 * @route '/kelas/{schoolClass}'
 */
    const destroyForm = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SchoolClassController::destroy
 * @see app/Http/Controllers/SchoolClassController.php:51
 * @route '/kelas/{schoolClass}'
 */
        destroyForm.delete = (args: { schoolClass: number | { id: number } } | [schoolClass: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const SchoolClassController = { index, store, update, destroy }

export default SchoolClassController