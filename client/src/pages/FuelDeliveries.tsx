import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { Delivery, DeliveryDate, Type } from "../graphql/schema";
import { Card, CardHeader, CardContent, Grid, Typography, Container, Box, CircularProgress } from "@mui/material";
import { DayDelivery } from '../components/DayDelivery';

const FuelDeliveries = (): JSX.Element => {

  const [deliveries, setDeliveries] = useState<DeliveryDate[]>([]);
  const arr: DeliveryDate[] = [];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [DATE] = tomorrow.toISOString().split('T');

  const headers = {
    'Accept': 'application/json',
    'UserID': 'r0533145417@gmail.com',
    'ApiKey': '8eeadf4932631a8ae38546dc39464d3ce0e482301d3c6b3219b4b399b698c5ea'
  };

  const getDelivers = async (date: String): Promise<DeliveryDate> => {
    return await fetch(`https://solar-rocket-fuel.benmanage.click/delivery/${date}`,
      {
        method: 'GET',
        headers: headers
      }).then((res => res.json())).then((data) => {
        return data;
      });
  }

  const getDates = async () => {
    return await fetch(`https://solar-rocket-fuel.benmanage.click/deliveries?startDate=${DATE}&numberOfDays=5`,
      {
        method: 'GET',
        headers: headers
      }).then((res => res.json())).then((data) => {
        data.deliveryDates.map((date: any) => getDelivers(String(date)).then((res: DeliveryDate) => {
          arr.push(res);
          setDeliveries([...arr]);
        }))
        return arr;
      });
  }

  useEffect(() => {
    getDates();
  }, []);

  return (
    < AppLayout title="Fuel Deliveries" >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {deliveries ? (
            deliveries.map((delivery: DeliveryDate, key: number) => (
              <DayDelivery key={key} date={delivery.date} deliveries={delivery.deliveries} />
            ))
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </Grid>
      </Container>
    </AppLayout >
  );
};

export { FuelDeliveries as FuelDeliveries };