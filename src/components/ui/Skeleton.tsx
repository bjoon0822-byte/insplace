'use client';

import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width, height, borderRadius, className }: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className ?? ''}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <div className={styles.cardSkeletonInner}>
        <Skeleton height="180px" borderRadius="22px 22px 0 0" />
        <div className={styles.cardSkeletonBody}>
          <Skeleton width="60px" height="22px" borderRadius="999px" />
          <Skeleton width="70%" height="20px" borderRadius="6px" />
          <Skeleton width="50%" height="14px" borderRadius="6px" />
          <div className={styles.cardSkeletonFooter}>
            <Skeleton width="40%" height="24px" borderRadius="6px" />
            <Skeleton width="25%" height="14px" borderRadius="6px" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.gridSkeleton}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className={styles.statSkeleton}>
      <Skeleton width="60%" height="14px" borderRadius="6px" />
      <Skeleton width="80%" height="28px" borderRadius="6px" />
      <Skeleton width="40%" height="14px" borderRadius="6px" />
    </div>
  );
}
