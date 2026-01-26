"use client";
import React from "react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          System configuration and preferences
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          General Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Enable Email Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send email alerts for critical events
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Auto-Assign Tasks
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically distribute tasks based on workload
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Require 2FA for Admins
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enforce two-factor authentication
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-500 peer-checked:after:translate-x-full dark:bg-gray-700"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Data Management
        </h2>
        <div className="space-y-3">
          <button className="w-full rounded-lg bg-blue-500 px-4 py-3 text-left font-medium text-white transition hover:bg-blue-600">
            Export All Data
          </button>
          <button className="w-full rounded-lg bg-orange-500 px-4 py-3 text-left font-medium text-white transition hover:bg-orange-600">
            Clear Cache
          </button>
          <button className="w-full rounded-lg bg-red-500 px-4 py-3 text-left font-medium text-white transition hover:bg-red-600">
            Reset Mock Data
          </button>
        </div>
      </div>
    </div>
  );
}
