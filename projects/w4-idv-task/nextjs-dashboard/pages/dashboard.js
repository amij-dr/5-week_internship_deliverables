// pages/dashboard.js in Next.js
import { Line } from 'react-chartjs-2';

const Dashboard = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.last_scanned),
        datasets: [{
            label: 'Quantity Over Time',
            data: data.map(d => d.quantity),
            borderColor: 'blue',
            fill: false
        }]
    };
    return <Line data={chartData} />
};

export async function getServerSideProps() {
    const res = await fetch('http://localhost/api/inventory');
    const data = await res.json();
    return { props: { data } }
}
export default Dashboard;