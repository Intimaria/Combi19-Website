import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import React from 'react';
import VerticalTicketRip from '@mui-treasury/components/rip/verticalTicket';
import cx from 'clsx';
import logo from "../images/logo_combi19.png"
import {useVerticalRipStyles} from '@mui-treasury/styles/rip/vertical';

export const PassengerTicket = React.memo(function PlaneTicketCard(props) {
  const { myTicket, useStyles, mainColor, lightColor} = props
    const styles = useStyles();
    const ripStyles = useVerticalRipStyles({
        size: 24,
        rightColor: lightColor,
        tearColor: mainColor,
    });
    return (
        <Card className={styles.card} elevation={0}>
            <div className={cx(styles.left, styles.moveLeft)}>
                <CardMedia
                    className={styles.media}
                    image={
                        logo
                    }
                />
            </div>
            <VerticalTicketRip
                classes={{
                    ...ripStyles,
                    left: cx(ripStyles.left, styles.moveLeft),
                    right: cx(ripStyles.right, styles.moveRight),
                }}
            />
            <div className={cx(styles.right, styles.moveRight)}>
            {/* <div><p className={styles.heading}>{myTicket.quantity}</p></div> */}
                <span className={styles.departureDay}>{myTicket.departureDay}</span>
                <div className={styles.label}>
                    <h2 className={styles.heading}>Origen</h2>
                    <p className={styles.subheader}>{myTicket.route.departure}</p>
                </div>
                <div className={styles.path}>
                    <div className={styles.line}>
                        <AirportShuttleIcon className={styles.plane}/>
                    </div>
                    <span className={styles.flight}>Patente: {props.tripToBuy.transport.registrationNumber}</span>
                </div>
                <div className={styles.label}>
                    <h2 className={styles.heading}>Destino</h2>
                    <p className={styles.subheader}>{myTicket.route.destination}</p>
                </div>
            </div>
        </Card>
    );
});

export default PassengerTicket;
