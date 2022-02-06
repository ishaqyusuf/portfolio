<?php

namespace App\ExpressApi;

class ExpressApiRoutes
{
    static $routes = [
        'builders' => BuilderService::class,
        'auth' => AuthService::class,
        'crash-report' => CrashReportService::class,
        'users' => UserService::class,
        'projects' => ProjectService::class,
        'productions' => ProductionService::class,
        'posts' => PostService::class,
        'tasks' => TaskService::class,
        'installations' => InstallationService::class,
        // 'proe' => InstallationService::class,
        'reset' => ResetService::class,
        'roles' => RoleService::class,
        // 'invoices' => InvoiceImportService::class,
        'dashboard' => DashboardService::class,
        'invoices' => InvoiceService::class
    ];
}
