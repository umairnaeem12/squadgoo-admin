import React from "react";

interface ComponentCardProps {
  title: string;
  desc?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode; // ✅ new prop for right-side header tools
  className?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  desc = "",
  children,
  headerRight,
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* === Card Header === */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {headerRight && <div className="flex items-center">{headerRight}</div>}
      </div>

      {/* === Card Body === */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-0 px-4 pb-2">
        {children}
      </div>
    </div>
  );
};

export default ComponentCard;
