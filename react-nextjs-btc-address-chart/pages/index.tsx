import Head from 'next/head'
import Layout from '../components/layout'
import { useRouter } from 'next/router'
import {GetServerSideProps} from 'next'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
  } from "chart.js";
  import "chartjs-adapter-date-fns";
  import { Line } from "react-chartjs-2";
  ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Legend,
    Tooltip,
  );
  import {enUS} from 'date-fns/locale';
import SelectButton from '../components/SelectButton';

export default function Home({ data }: {data: any}) {
    const router = useRouter();
    const { query } = router;
    const chartData = {datasets: [
        {
            label: ">$1K",
            data: data.oneKData,
            borderColor: "#2e1065",
          },
          {
            label: ">$10K",
            data: data.tenKData,
            borderColor: "#8a0069",
          },
          {
            label: ">$100K",
            data: data.oneHundredKData,
            borderColor: "#ce1957",
          },
          {
            label: ">$1M",
            data: data.oneMilData,
            borderColor: "#f75f38",
          },
          {
            label: ">$10M",
            data: data.tenMilData,
            borderColor: "#ffa600",
          },
    ]}
    const options = {scales: {
        x: {
            adapters: {
                date: {
                    locale: enUS,
                }
            },
            type: "time",
            time: {
              unit: "year",
            },
        }
      }};

      const handleClick = (value: string) => {
        if (value === "all") {
            router.push("");
        } else {
            router.push(`?period=${value}`);
        }
      };

    return (
        <Layout home>
            <Head>
                <title>BTC Address Balances over Time</title>
            </Head>
            <section>
                <div className="max-w-2xl mx-auto px-8 mb-2 text-center">
                <Line
                    // options={options}
                    data={chartData}
                    datasetIdKey="id"
                />
                </div>
                <div className='mx-auto max-w-2xl px-8 text-right'>
                    <SelectButton onClick={() => {handleClick("all")}} title="All" isSelected={!query.period} />
                    <SelectButton onClick={() => {handleClick("YTD")}} title="YTD" isSelected={query.period === "YTD"}/>
                    <SelectButton onClick={() => {handleClick("12")}} title="12M" isSelected={query.period === "12"}/>
                    <SelectButton onClick={() => {handleClick("3")}} title="3M" isSelected={query.period === "3"}/>
                    <SelectButton onClick={() => {handleClick("1")}} title="1M" isSelected={query.period === "1"}/>
                </div>
            </section>
        </Layout>
    )
}

const getChartData = async (period: string) => {
    const res = await fetch(`http://localhost:3000/api/btc-addresses${!!period ? `?period=${period}` : ''}`);
    return res.json();
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { query } = context;
    const data = await getChartData(query.period as string);
    return {
        props: {
            data
        }
    }
}
