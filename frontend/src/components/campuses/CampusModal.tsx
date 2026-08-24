"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import { Campus, CampusPayload } from "@/src/services/campus.service";

interface CampusModalProps {
  open: boolean;
  campus?: Campus | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CampusPayload) => Promise<void>;
}

export default function CampusModal({
  open,
  campus,
  loading = false,
  onClose,
  onSubmit,
}: CampusModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const editing = Boolean(campus);

  useEffect(() => {
    if (campus) {
      setName(campus.name);
      setLocation(campus.location);
      setDescription(campus.description || "");
    } else {
      setName("");
      setLocation("");
      setDescription("");
    }

    setError("");
  }, [campus, open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Campus name is required.");
      return;
    }

    if (!location.trim()) {
      setError("Campus location is required.");
      return;
    }

    setError("");

    try {
      await onSubmit({
        name: name.trim(),
        location: location.trim(),
        description: description.trim(),
      });
    } catch (error) {
      console.error(error);

      setError("Unable to save campus. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editing ? "Edit Campus" : "Add Campus"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update campus information."
                : "Add a new university campus."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Campus Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Engineering Campus"
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 text-slate-500 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-100"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g. Main University"
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 text-slate-500 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Brief description of the campus..."
              rows={4}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-slate-300 text-slate-500 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-100"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}

              {loading
                ? "Saving..."
                : editing
                  ? "Update Campus"
                  : "Create Campus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
