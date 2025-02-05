import { useEffect, useState } from 'react';
import axios from 'axios';
import StockChart from './components/StockChart.jsx';

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDark, setIsDark] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStock, setSelectedStock] = useState(null);
    const [analysis, setAnalysis] = useState({
        topGainers: [],
        topLosers: [],
        avgChange: 0
    });

    // Arama sonuçlarını filtreleme
    const filteredStocks = data.filter(stock =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const analyzeStocks = (stocks) => {
        if (!stocks?.length) return null;

        // En yüksek artış ve düşüş gösteren hisseleri bulalım
        const sortedByChange = [...stocks].sort((a, b) => 
            parseFloat(b.change.replace(',', '.')) - parseFloat(a.change.replace(',', '.'))
        );

        const topGainers = sortedByChange.slice(0, 5);
        const topLosers = sortedByChange.slice(-5).reverse();

        // Ortalama değişim hesaplayalım
        const avgChange = stocks.reduce((acc, stock) => 
            acc + parseFloat(stock.change.replace(',', '.')), 0
        ) / stocks.length;

        return {
            topGainers,
            topLosers,
            avgChange: avgChange.toFixed(2)
        };
    };

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_API_URL, {
                    
                });
                
                if (response.data?.data) {
                    setData(response.data.data);
                    const analysisResult = analyzeStocks(response.data.data);
                    if (analysisResult) {
                        setAnalysis(analysisResult);
                    }
                }
            } catch (err) {
                setError(err.message || 'Veri çekilirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // 1 dakikada bir güncelle
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Bir hisse seçildiğinde search'ü temizle
    const handleStockSelect = (stock) => {
        setSelectedStock(stock);
        setSearchTerm(''); // Search'ü temizle
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                Hata: {error}
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                        Borsa İstanbul Analiz Paneli
                    </h1>
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 h-10 px-4 py-2"
                    >
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Hisse senedi ara..."
                            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-400"
                        />
                        {searchTerm && filteredStocks.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg max-h-96 overflow-auto">
                                {filteredStocks.map((stock) => (
                                    <div
                                        key={stock.name}
                                        onClick={() => handleStockSelect(stock)}
                                        className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                                    >
                                        <span className="font-medium">{stock.name}</span>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-zinc-600 dark:text-zinc-400">
                                                ₺{stock.price}
                                            </span>
                                            <span className={`font-bold ${
                                                parseFloat(stock.change) > 0 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {parseFloat(stock.change) > 0 ? '+' : ''}%{stock.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Stock Details */}
                {selectedStock && (
                    <div className="mb-8 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                                {selectedStock.name} Detayları
                            </h2>
                            <button
                                onClick={() => setSelectedStock(null)}
                                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-md bg-zinc-50 dark:bg-zinc-900">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Fiyat</div>
                                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    ₺{selectedStock.price}
                                </div>
                            </div>
                            <div className="p-4 rounded-md bg-zinc-50 dark:bg-zinc-900">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Değişim</div>
                                <div className={`text-lg font-bold ${
                                    parseFloat(selectedStock.change) > 0 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {parseFloat(selectedStock.change) > 0 ? '+' : ''}%{selectedStock.change}
                                </div>
                            </div>
                            <div className="p-4 rounded-md bg-zinc-50 dark:bg-zinc-900">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">Son Güncelleme</div>
                                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                    {selectedStock.time}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analiz Özeti */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 p-6">
                        <h3 className="text-lg font-semibold mb-4">En Çok Yükselenler</h3>
                        <div className="space-y-2">
                            {analysis.topGainers.map((stock) => (
                                <div key={stock.name} 
                                    className="flex items-center justify-between rounded-md border border-zinc-200 dark:border-zinc-800 p-3 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                    onClick={() => handleStockSelect(stock)}
                                >
                                    <span className="font-medium">{stock.name}</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                                        +%{stock.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 p-6">
                        <h3 className="text-lg font-semibold mb-4">En Çok Düşenler</h3>
                        <div className="space-y-2">
                            {analysis.topLosers.map((stock) => (
                                <div key={stock.name} 
                                    className="flex items-center justify-between rounded-md border border-zinc-200 dark:border-zinc-800 p-3 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                    onClick={() => handleStockSelect(stock)}
                                >
                                    <span className="font-medium">{stock.name}</span>
                                    <span className="text-red-600 dark:text-red-400 font-bold text-lg">
                                        %{stock.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Piyasa Özeti</h2>
                        <span className={`inline-flex items-center rounded-md px-3 py-1.5 text-base font-bold ring-1 ring-inset transition-all duration-300 ${
                            analysis.avgChange > 0 
                                ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/10 dark:text-green-400 dark:ring-green-500/20 animate-pulse' 
                                : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-500/20 animate-pulse'
                        }`}>
                            {analysis.avgChange > 0 ? '+' : ''}%{analysis.avgChange}
                        </span>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        {analysis.avgChange > 0 
                            ? "Piyasa genel olarak pozitif bir eğilim gösteriyor."
                            : "Piyasa genel olarak negatif bir eğilim gösteriyor."}
                    </p>
                </div>

                {/* Grafik */}
                <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Hisse Performans Grafiği
                    </h2>
                    <StockChart data={data} isDark={isDark} />
                </div>
            </div>
        </div>
    );
}

export default App;