import PropTypes from 'prop-types';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js kayıt işlemi
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StockChart = ({ data, isDark }) => {
    // En çok işlem gören 20 hisseyi gösterelim
    const topStocks = data?.slice(0, 20) || [];

    const chartData = {
        labels: topStocks.map(stock => stock.name),
        datasets: [
            {
                label: 'Fiyat (TL)',
                data: topStocks.map(stock => parseFloat(stock.price.replace(',', '.'))),
                borderColor: isDark ? 'rgba(74, 222, 128, 1)' : 'rgb(75, 192, 192)',
                backgroundColor: isDark ? 'rgba(74, 222, 128, 0.5)' : 'rgba(75, 192, 192, 0.5)',
                yAxisID: 'price',
            },
            {
                label: 'Değişim (%)',
                data: topStocks.map(stock => parseFloat(stock.change.replace(',', '.'))),
                borderColor: isDark ? 'rgba(248, 113, 113, 1)' : 'rgb(255, 99, 132)',
                backgroundColor: isDark ? 'rgba(248, 113, 113, 0.5)' : 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'change',
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: isDark ? '#fff' : '#666',
                }
            },
            title: {
                display: true,
                text: 'Hisse Senedi Performans Grafiği',
                color: isDark ? '#fff' : '#333',
            },
        },
        scales: {
            price: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: isDark ? '#fff' : '#666',
                },
                title: {
                    display: true,
                    text: 'Fiyat (TL)',
                    color: isDark ? '#fff' : '#666',
                }
            },
            change: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    color: isDark ? '#fff' : '#666',
                },
                title: {
                    display: true,
                    text: 'Değişim (%)',
                    color: isDark ? '#fff' : '#666',
                }
            },
        },
    };

    return (
        <div className="w-full h-[400px]">
            <Line options={options} data={chartData} />
        </div>
    );
};

StockChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            price: PropTypes.string.isRequired,
            change: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
        })
    ).isRequired,
    isDark: PropTypes.bool.isRequired,
};

export default StockChart; 