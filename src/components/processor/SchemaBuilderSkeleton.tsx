import React from 'react';

const SkeletonField: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600 animate-pulse">
        <div className="md:col-span-3 space-y-2">
            <div className="h-4 bg-slate-600 rounded w-1/3"></div>
            <div className="h-9 bg-slate-800 rounded w-full"></div>
        </div>
        <div className="md:col-span-6 space-y-2">
            <div className="h-4 bg-slate-600 rounded w-1/3"></div>
            <div className="h-9 bg-slate-800 rounded w-full"></div>
        </div>
        <div className="md:col-span-2 space-y-2">
            <div className="h-4 bg-slate-600 rounded w-1/2"></div>
            <div className="h-9 bg-slate-800 rounded w-full"></div>
        </div>
        <div className="md:col-span-1 flex items-end">
            <div className="h-9 w-full bg-slate-800 rounded"></div>
        </div>
    </div>
);


const SchemaBuilderSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <SkeletonField />
      <SkeletonField />
      <SkeletonField />
    </div>
  );
};

export default SchemaBuilderSkeleton;