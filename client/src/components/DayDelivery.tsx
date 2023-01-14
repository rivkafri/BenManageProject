import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import ReactMarkdown from "react-markdown";
import { Grid, Typography, Fab, CardMedia, Card, CardContent } from "@mui/material";
import React from "react";
import { Delivery, DeliveryDate, Type } from "../graphql/schema";

type Props = {
    key: number,
    date: String,
    deliveries: Delivery[],
};

const DayDelivery: React.FC<Props> = (props: Props): JSX.Element => {

    return (
        <Grid item>
            <Typography >
                {props.date}
            </Typography>
            {props.deliveries.map((detailes: any, key: number) => (
                <div key={key}>
                    <br />
                    <Card sx={{ width: 130, height: 230 }}>
                        <CardMedia
                            component="img"
                            alt="system"
                            height="130"
                            image={detailes.icon.toString()}
                        />
                        <CardContent >
                            <Typography noWrap variant="body2" color="text.secondary" component="h5">
                                {"type: " + detailes.type}
                            </Typography>
                            <Typography noWrap variant="body2" color="text.secondary" component="h5">
                                {"unit: " + detailes.unit}
                            </Typography>
                            <Typography noWrap variant="body2" color="text.secondary" component="h5">
                                {"quantity: " + detailes.quantity.toString()}
                            </Typography>
                            <Typography noWrap variant="body2" color="text.secondary" component="h5">
                                {props.date}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </Grid>
    );
};

export { DayDelivery };