<?php

namespace App\Core;

use App\Helpers\Response;

class Router
{
    private array $routes = [];

    public function addRoute(string $method, string $path, string $controllerClass, string $action): void
    {
        $this->routes[] = [
            'method'     => strtoupper($method),
            'path'       => $path,
            'controller' => $controllerClass,
            'action'     => $action
        ];
    }

    public function get(string $path, string $controller, string $action): void
    {
        $this->addRoute('GET', $path, $controller, $action);
    }

    public function post(string $path, string $controller, string $action): void
    {
        $this->addRoute('POST', $path, $controller, $action);
    }

    public function put(string $path, string $controller, string $action): void
    {
        $this->addRoute('PUT', $path, $controller, $action);
    }

    public function patch(string $path, string $controller, string $action): void
    {
        $this->addRoute('PATCH', $path, $controller, $action);
    }

    public function delete(string $path, string $controller, string $action): void
    {
        $this->addRoute('DELETE', $path, $controller, $action);
    }

    public function dispatch(string $method, string $uri): void
    {
        $method = strtoupper($method);

        foreach ($this->routes as $route) {
            $params = $this->matchRoute($route['path'], $uri);

            if ($params !== false && $route['method'] === $method) {
                $controllerName = $route['controller'];
                $action = $route['action'];

                if (!class_exists($controllerName)) {
                    Response::error("Controller {$controllerName} tidak ditemukan.", null, 500);
                }

                $controller = new $controllerName();

                if (!method_exists($controller, $action)) {
                    Response::error("Action {$action} tidak ditemukan.", null, 500);
                }

                call_user_func_array([$controller, $action], $params);
                return;
            }
        }

        Response::error('Endpoint tidak ditemukan.', null, 404);
    }

    private function matchRoute(string $pattern, string $uri): array|false
    {
        $pattern = trim($pattern, '/');
        $uri = trim($uri, '/');

        if ($pattern === $uri) {
            return [];
        }

        $patternParts = explode('/', $pattern);
        $uriParts = explode('/', $uri);

        if (count($patternParts) !== count($uriParts)) {
            return false;
        }

        $params = [];

        for ($i = 0; $i < count($patternParts); $i++) {
            if (preg_match('/^\{([a-zA-Z0-9_]+)\}$/', $patternParts[$i], $matches)) {
                $params[] = $uriParts[$i];
            } elseif ($patternParts[$i] !== $uriParts[$i]) {
                return false;
            }
        }

        return $params;
    }
}
