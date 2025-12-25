"use client";

import { useState, ReactNode } from "react";

export interface TabItem {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActive?: number;
}

export default function Tabs({ items, defaultActive = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActive);

  return (
    <div className="de-tab plain">
      <ul className="d-tab-nav mb-4 border-bottom pb-4 d-flex justify-content-between">
        {items.map((item, index) => (
          <li
            key={index}
            className={activeTab === index ? "active-tab" : ""}
            onClick={() => setActiveTab(index)}
            style={{ cursor: "pointer" }}
          >
            {item.label}
          </li>
        ))}
      </ul>
      <ul className="d-tab-content pt-3">
        {items.map((item, index) => (
          <li
            key={index}
            style={{ display: activeTab === index ? "block" : "none" }}
          >
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
