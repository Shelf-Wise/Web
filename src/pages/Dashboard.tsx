import { LineChartView } from "@/components/charts/test/LineChart";

export default function Dashboard() {
  return (
    <div className="px-16">
      <div className="w-[50%]">
        <LineChartView />
      </div>
    </div>
  );
}
