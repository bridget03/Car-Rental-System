import Link from "next/link";
import styles from "./Pagination.module.css";
import React, { useState } from "react";
import { TbChevronLeft } from "react-icons/tb";
import { TbChevronRight } from "react-icons/tb";
import { TbChevronLeftPipe } from "react-icons/tb";
import { TbChevronRightPipe } from "react-icons/tb";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { ItemPerPageProps, PaginationProps } from "@/utils/types/Pagination";

function Pagination({
  children,
  className = "",
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  currentPage,
}: PaginationProps) {
  return (
    <div className={`${styles.pagination} ${className}`}>
      <ItemPerPage
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
        totalItems={totalItems}
        currentPage={currentPage}
      />
      <PaginationContainer>{children}</PaginationContainer>
    </div>
  );
}

function PaginationContainer({ children }: { children: React.ReactNode }) {
  return <div className={styles["pagination-container"]}>{children}</div>;
}
function PaginationEnd({
  href,
  isDisabled,
  position,
}: {
  href: string;
  isDisabled: boolean;
  position: "start" | "end";
}) {
  return (
    <Link href={href}>
      <button
        className={`${styles.buttonStyle} ${
          isDisabled ? styles.disabledStyle : ""
        }`}
      >
        {position === "start" ? <TbChevronLeftPipe /> : <TbChevronRightPipe />}
      </button>
    </Link>
  );
}
function PaginationArrow({
  direction,
  href,
  isDisabled,
}: {
  direction: "left" | "right";
  href: string;
  isDisabled: boolean;
}) {
  return (
    <Link href={href}>
      <button
        className={`${styles.buttonStyle} ${
          isDisabled ? styles.disabledStyle : ""
        }`}
      >
        {direction === "left" ? <TbChevronLeft /> : <TbChevronRight />}
      </button>
    </Link>
  );
}
function PaginationItem({
  children,
  href,
  isActive,
}: {
  children: React.ReactNode;
  href: string;
  isActive?: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <button
        className={`${styles.buttonStyle} ${
          isActive ? styles.activeStyle : ""
        }`}
      >
        {children}
      </button>
    </Link>
  );
}
function PaginationEllipsis() {
  return (
    <div className={`${styles.buttonStyle} ${styles.disabledStyle}`}>
      <IoEllipsisHorizontalSharp />
    </div>
  );
}

function ItemPerPage({
  value,
  onChange,
  totalItems,
  currentPage,
}: ItemPerPageProps) {
  const handleChangeOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  const startItem = (currentPage - 1) * value + 1;
  const endItem = Math.min(currentPage * value, totalItems);

  return (
    <div className={styles["items-per-page-container"]}>
      <span>Items per page</span>
      <select
        className={styles.selectBox}
        onChange={handleChangeOptions}
        value={value}
      >
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
      </select>
      <span className={styles.secondaryText}>
        {startItem} - {endItem} of {totalItems} items
      </span>
    </div>
  );
}

export {
  Pagination,
  PaginationArrow,
  PaginationEllipsis,
  PaginationEnd,
  PaginationItem,
  PaginationContainer,
};
