"use client";

import { useMemo, useState } from "react";
import {
    selectTemperatureAverageC,
    selectTemperatureCount,
    selectTemperatureItems,
    temperatureAdded,
    temperatureRemoved,
    temperaturesCleared,
} from "@/redux/temperatureSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppState";

function formatDateTime(iso: string) {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
}

export default function TemperaturePage() {
    const dispatch = useAppDispatch();
    const items = useAppSelector(selectTemperatureItems);
    const count = useAppSelector(selectTemperatureCount);
    const averageC = useAppSelector(selectTemperatureAverageC);

    const [valueInput, setValueInput] = useState<string>("");
    const valueAsNumber = useMemo(() => Number(valueInput), [valueInput]);

    const canAdd =
        valueInput.trim().length > 0 &&
        Number.isFinite(valueAsNumber) &&
        valueAsNumber >= -100 &&
        valueAsNumber <= 100;

    function onAdd() {
        if (!canAdd) return;
        dispatch(temperatureAdded(valueAsNumber));
        setValueInput("");
    }

    return (
        <div className="mx-auto w-full max-w-3xl p-6 text-black">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Temperature (Redux Toolkit)</h1>
                <p className="text-sm text-gray-600">
                    ตัวอย่าง Redux Toolkit: เพิ่ม/ลบ และดึงข้อมูลจาก store มาแสดงผล
                </p>
            </div>

            <div className="mb-6 rounded-lg border bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label className="flex w-full flex-col gap-1">
                        <span className="text-sm font-medium">Temperature (°C)</span>
                        <input
                            value={valueInput}
                            onChange={(e) => setValueInput(e.target.value)}
                            inputMode="decimal"
                            placeholder="เช่น 25.5"
                            className="w-full rounded-md border px-3 py-2 outline-none focus:border-blue-500"
                        />
                        <span className="text-xs text-gray-500">
                            รับค่าระหว่าง -100 ถึง 100
                        </span>
                    </label>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onAdd}
                            disabled={!canAdd}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() => dispatch(temperaturesCleared())}
                            disabled={items.length === 0}
                            className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-white p-4">
                    <div className="text-xs text-gray-500">Count</div>
                    <div className="text-xl font-semibold">{count}</div>
                </div>
                <div className="rounded-lg border bg-white p-4">
                    <div className="text-xs text-gray-500">Average (°C)</div>
                    <div className="text-xl font-semibold">
                        {averageC === null ? "-" : averageC.toFixed(2)}
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-4">
                    <div className="text-xs text-gray-500">Latest</div>
                    <div className="text-xl font-semibold">
                        {items[0]?.valueC ?? "-"}
                    </div>
                </div>
            </div>

            <div className="rounded-lg border bg-white">
                <div className="border-b p-4">
                    <h2 className="text-base font-semibold">รายการ Temperature</h2>
                </div>

                {items.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600">
                        ยังไม่มีข้อมูล ลองเพิ่มค่าอุณหภูมิด้านบน
                    </div>
                ) : (
                    <ul className="divide-y">
                        {items.map((item) => (
                            <li key={item.id} className="flex items-center justify-between p-4">
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.valueC} °C</span>
                                    <span className="text-xs text-gray-500">
                                        {formatDateTime(item.createdAt)}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => dispatch(temperatureRemoved({ id: item.id }))}
                                    className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

