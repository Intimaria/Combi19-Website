import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import React, { useState } from 'react';
import VerticalTicketRip from '@mui-treasury/components/rip/verticalTicket';
import cx from 'clsx';
import logo from "../images/logo_combi19.png"
import {makeStyles} from '@material-ui/core/styles';
import {useVerticalRipStyles} from '@mui-treasury/styles/rip/vertical';

const useStyles = makeStyles(({palette, breakpoints}) => ({
    card: {
        overflow: 'visible',
        background: 'none',
        display: 'flex',
        minWidth: 343,
        minHeight: 150,
        filter: 'drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3))',
        '& $moveLeft, $moveRight': {
            transition: '0.3s',
        },
        [breakpoints.up('sm')]: {
            minWidth: 400,
        },
    },
    left: {
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        flexBasis: '20%',
        display: 'flex',
        backgroundColor: '#fff',
    },
    media: {
        margin: 'auto',
        width: 80,
        height: 80,
        borderRadius: '50%',
    },
    right: {
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        flex: 1,
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: (props) => props.lightColor,
    },
    label: {
        padding: '0 8px',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 0,
        marginBottom: 4,
    },
    subheader: {
        fontSize: 12,
        margin: 0,
        color: palette.text.secondary,
    },
    path: {
        flex: 1,
        flexBasis: 72,
        padding: '0 4px',
    },
    line: {
        position: 'relative',
        margin: '20px 0 16px',
        borderBottom: '1px dashed rgba(0,0,0,0.38)',
    },
    plane: {
        position: 'absolute',
        display: 'inline-block',
        padding: '0 4px',
        fontSize: 32,
        backgroundColor: (props) => props.lightColor,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    flight: {
        fontSize: 14,
        lineHeight: '24px',
        minWidth: 48,
        padding: '0 8px',
        borderRadius: 40,
        backgroundColor: (props) => props.insert,
        color: (props) => props.mainColor,
        display: 'block',
    },
    departureDay: {
        fontSize: 14,
        lineHeight: '24px',
        minWidth: 48,
        padding: '0 8px',
        borderRadius: 40,
        backgroundColor: (props) => props.insert,
        color: (props) => props.mainColor,
        display: 'block',
        transform: 'rotate(270deg)',
    },
    moveLeft: {},
    moveRight: {},
  }));


export const PassengerTicket = React.memo(function PlaneTicketCard(props) {
  const { myTicket } = props
    const styles = useStyles(props);
    const cancelled = myTicket.percentage
    const ripStyles = useVerticalRipStyles({
        size: 24,
        rightColor: props.lightColor,
        tearColor: props.mainColor,
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
             { props.cancelled &&
            <div><p className={styles.heading}>{myTicket.percentage}</p></div>
             }
                <span className={styles.departureDay}>{myTicket.departureDay}</span>
                <div className={styles.label}>
                    <h2 className={styles.heading}>Origen</h2>
                    <p className={styles.subheader}>{myTicket.route.departure}</p>
                </div>
                <div className={styles.path}>
                    <div className={styles.line}>
                        <AirportShuttleIcon className={styles.plane}/>
                    </div>
                    <span className={styles.flight}>Patente: {myTicket.transport.registrationNumber}</span>
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
