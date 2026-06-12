import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ClassTeacherController::index
 * @see app/Http/Controllers/ClassTeacherController.php:16
 * @route '/wali-kelas-management'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/wali-kelas-management',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassTeacherController::index
 * @see app/Http/Controllers/ClassTeacherController.php:16
 * @route '/wali-kelas-management'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassTeacherController::index
 * @see app/Http/Controllers/ClassTeacherController.php:16
 * @route '/wali-kelas-management'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassTeacherController::index
 * @see app/Http/Controllers/ClassTeacherController.php:16
 * @route '/wali-kelas-management'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassTeacherController::index
 * @see app/Http/Controllers/ClassTeacherController.php:16
 * @route '/wali-kelas-management'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassTeacherController::index
 * @see app/Http/Controllers/ClassTeacherController.php:16
 * @route '/wali-kelas-management'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassTeacherController::index
 * @see app/Http/Controllers/ClassTeacherController.php:16
 * @route '/wali-kelas-management'
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
* @see \App\Http\Controllers\ClassTeacherController::create
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/wali-kelas-management/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassTeacherController::create
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassTeacherController::create
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassTeacherController::create
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassTeacherController::create
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassTeacherController::create
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassTeacherController::create
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ClassTeacherController::store
 * @see app/Http/Controllers/ClassTeacherController.php:53
 * @route '/wali-kelas-management'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/wali-kelas-management',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClassTeacherController::store
 * @see app/Http/Controllers/ClassTeacherController.php:53
 * @route '/wali-kelas-management'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassTeacherController::store
 * @see app/Http/Controllers/ClassTeacherController.php:53
 * @route '/wali-kelas-management'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClassTeacherController::store
 * @see app/Http/Controllers/ClassTeacherController.php:53
 * @route '/wali-kelas-management'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClassTeacherController::store
 * @see app/Http/Controllers/ClassTeacherController.php:53
 * @route '/wali-kelas-management'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ClassTeacherController::show
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}'
 */
export const show = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/wali-kelas-management/{classTeacher}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassTeacherController::show
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}'
 */
show.url = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classTeacher: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    classTeacher: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        classTeacher: args.classTeacher,
                }

    return show.definition.url
            .replace('{classTeacher}', parsedArgs.classTeacher.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassTeacherController::show
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}'
 */
show.get = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassTeacherController::show
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}'
 */
show.head = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassTeacherController::show
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}'
 */
    const showForm = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassTeacherController::show
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}'
 */
        showForm.get = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassTeacherController::show
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}'
 */
        showForm.head = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\ClassTeacherController::edit
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}/edit'
 */
export const edit = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/wali-kelas-management/{classTeacher}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ClassTeacherController::edit
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}/edit'
 */
edit.url = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classTeacher: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    classTeacher: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        classTeacher: args.classTeacher,
                }

    return edit.definition.url
            .replace('{classTeacher}', parsedArgs.classTeacher.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassTeacherController::edit
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}/edit'
 */
edit.get = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ClassTeacherController::edit
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}/edit'
 */
edit.head = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ClassTeacherController::edit
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}/edit'
 */
    const editForm = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ClassTeacherController::edit
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}/edit'
 */
        editForm.get = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ClassTeacherController::edit
 * @see app/Http/Controllers/ClassTeacherController.php:0
 * @route '/wali-kelas-management/{classTeacher}/edit'
 */
        editForm.head = (args: { classTeacher: string | number } | [classTeacher: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\ClassTeacherController::update
 * @see app/Http/Controllers/ClassTeacherController.php:86
 * @route '/wali-kelas-management/{classTeacher}'
 */
export const update = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/wali-kelas-management/{classTeacher}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ClassTeacherController::update
 * @see app/Http/Controllers/ClassTeacherController.php:86
 * @route '/wali-kelas-management/{classTeacher}'
 */
update.url = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classTeacher: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { classTeacher: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    classTeacher: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        classTeacher: typeof args.classTeacher === 'object'
                ? args.classTeacher.id
                : args.classTeacher,
                }

    return update.definition.url
            .replace('{classTeacher}', parsedArgs.classTeacher.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassTeacherController::update
 * @see app/Http/Controllers/ClassTeacherController.php:86
 * @route '/wali-kelas-management/{classTeacher}'
 */
update.put = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ClassTeacherController::update
 * @see app/Http/Controllers/ClassTeacherController.php:86
 * @route '/wali-kelas-management/{classTeacher}'
 */
update.patch = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ClassTeacherController::update
 * @see app/Http/Controllers/ClassTeacherController.php:86
 * @route '/wali-kelas-management/{classTeacher}'
 */
    const updateForm = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClassTeacherController::update
 * @see app/Http/Controllers/ClassTeacherController.php:86
 * @route '/wali-kelas-management/{classTeacher}'
 */
        updateForm.put = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ClassTeacherController::update
 * @see app/Http/Controllers/ClassTeacherController.php:86
 * @route '/wali-kelas-management/{classTeacher}'
 */
        updateForm.patch = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ClassTeacherController::destroy
 * @see app/Http/Controllers/ClassTeacherController.php:120
 * @route '/wali-kelas-management/{classTeacher}'
 */
export const destroy = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/wali-kelas-management/{classTeacher}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ClassTeacherController::destroy
 * @see app/Http/Controllers/ClassTeacherController.php:120
 * @route '/wali-kelas-management/{classTeacher}'
 */
destroy.url = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { classTeacher: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { classTeacher: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    classTeacher: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        classTeacher: typeof args.classTeacher === 'object'
                ? args.classTeacher.id
                : args.classTeacher,
                }

    return destroy.definition.url
            .replace('{classTeacher}', parsedArgs.classTeacher.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClassTeacherController::destroy
 * @see app/Http/Controllers/ClassTeacherController.php:120
 * @route '/wali-kelas-management/{classTeacher}'
 */
destroy.delete = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ClassTeacherController::destroy
 * @see app/Http/Controllers/ClassTeacherController.php:120
 * @route '/wali-kelas-management/{classTeacher}'
 */
    const destroyForm = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClassTeacherController::destroy
 * @see app/Http/Controllers/ClassTeacherController.php:120
 * @route '/wali-kelas-management/{classTeacher}'
 */
        destroyForm.delete = (args: { classTeacher: number | { id: number } } | [classTeacher: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ClassTeacherController = { index, create, store, show, edit, update, destroy }

export default ClassTeacherController