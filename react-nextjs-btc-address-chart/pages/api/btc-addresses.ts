import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs';
import path from 'path';
import { subMonths, startOfYear, format, isAfter } from 'date-fns';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const periodQuery = query.period as string;
  const includesPeriodQuery = !!periodQuery;
  const csvDirectory = path.join(process.cwd(), 'data');
  const fileContents = await fs.readFile(csvDirectory + '/Coin_Metrics_Network_Data_2023-02-02T14-32.csv', "utf-8");
  const splitFile = fileContents.split("\n");
  console.log(splitFile);
  const arrayData = splitFile.slice(1, splitFile.length);
  const labels: string[] = [];
  const oneKData: string[] = [];
  const tenKData: string[]= [];
  const oneHundredKData: string[] = [];
  const oneMilData: string[] = [];
  const tenMilData: string[] = [];
  arrayData.forEach((dataString => {
    const rowArray = dataString.split("\t");
      labels.push(rowArray[0].replaceAll("\"", ""));
      oneKData.push(rowArray[1]);
      tenKData.push(rowArray[2]);
      oneHundredKData.push(rowArray[3]);
      oneMilData.push(rowArray[4]);
      tenMilData.push(rowArray[5]);
  }));

  if (includesPeriodQuery) {
    const isYTD = periodQuery === "YTD";
    const dateFormat = "yyyy-MM-dd";
    const today = new Date;
    const startDate = isYTD ? format(startOfYear(today), dateFormat) : format(subMonths(today, parseInt(periodQuery, 10)), dateFormat);
    const firstDateIndex = labels.findIndex(value => {
      isAfter(new Date(value), new Date(startDate));
    });
    res.status(200).json({
      labels: labels.slice(firstDateIndex, labels.length),
      oneKData: oneKData.slice(firstDateIndex, labels.length),
      tenKData: tenKData.slice(firstDateIndex, labels.length),
      oneHundredKData: oneHundredKData.slice(firstDateIndex, labels.length),
      oneMilData: oneMilData.slice(firstDateIndex, labels.length),
      tenMilData: tenMilData.slice(firstDateIndex, labels.length),
    });
  } else {
    res.status(200).json({
      labels,
      oneKData,
      tenKData,
      oneHundredKData,
      oneMilData,
      tenMilData,
    });
  }
}
