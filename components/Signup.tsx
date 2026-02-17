"use client";

import { useAppContext } from "@/app/context/context";
import { useState } from "react";
import PlusIcon from "./icons/PlusIcon";
import Modal from "./Modal";

export default function Signup() {
  const { setRefresh } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    localStorage.clear();
    setRefresh(true);
    setShowModal(false);
  };

  return (
    <>
      <button
        className="py-2 px-3 bg-nodebg rounded-lg border border-[#454545]/50 
       flex gap-2 font-medium items-center cursor-pointer hover:bg-button-focus pointer-events-auto transition-colors"
        onClick={() => setShowModal(true)}
      >
        <PlusIcon />
        <p className="text-sm text-input">New Flow</p>
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title="Start a new flow?"
        message="This will delete your current flow and start from scratch. Are you sure you want to proceed?"
        confirmText="Start New Flow"
        cancelText="Cancel"
      />
    </>
  );
}
