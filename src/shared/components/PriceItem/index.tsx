import React, { useContext } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ProtonService from '../../services/proton.service';
import { authContext } from '../../../shared/providers/AuthProvider'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: 1.5rem;
  opacity: .6;
  transition: all .2s ease-in-out;
  &.popular {
    opacity: 1;
    border: 2px solid #E3C681;
    position: relative;
    opacity: 1;
    &:before {
      content: 'Most Popular';
      text-align: center;
      color: #fff;
      background: #E3C681;
      position: absolute;
      width: calc(100% + 4px);
      top: 0; left: -2px;
      margin-top: -20px;
      height: 30px;
      line-height: 30px;
    }
  }
  &:hover {
    opacity: 1;
  }
`
const PriceDescription = styled.p`
  font-size: .9rem;
  color: #fff;
  padding-bottom: 1.5em;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,.1);
`
const PriceListItem = styled.li`
  width: 100%;
  color: #fff;
  font-weight: bold;
  font-size: .9rem;
`
const PriceItemTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: auto;
  color: #fff;
`
const PriceItemCost = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #E3C681;
`

const PriceItem = ({ data }) => {
  const history = useHistory()
  const timeout = ms => new Promise(res => setTimeout(res, ms))
  const { authenticate, updateMember, currentUser } = useContext(authContext)

  const handleClick = async () => {
    try {
      let user = currentUser;
      if (!user) {
        const result = await authenticate()
        if (!result.success) throw new Error();
        user = result.user;
        await timeout(4000)
      }
      const tx = await ProtonService.sendTransaction(data.cost, data.id)
      await updateMember(user, data.id);

      if (tx.processed.id) {
        history.push('/artist');
      }
    } catch (err) {
      console.log('error paying', err);
    }
  }

  return (
    <div className="column">
      <PriceBox className={data.popular ? 'popular' : ''}>
        <div className="flex-row">
          <PriceItemTitle>{data.title}</PriceItemTitle>
          <PriceItemCost>${data.cost}</PriceItemCost>
        </div>
        <PriceDescription>
          {data.description}
        </PriceDescription>
        <ul className="full-width mb-5">
          {data.list.map(el =>
            <PriceListItem key={el}>
              <FontAwesomeIcon icon="check" size="sm" className="mr-2 primary-color" />
              {el}
            </PriceListItem>
          )}
        </ul>
        <button className="button is-primary full-width" onClick={handleClick}>Join</button>
      </PriceBox>
    </div>
)}

export default PriceItem
