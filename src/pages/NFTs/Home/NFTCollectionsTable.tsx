/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, FC } from 'react'
import { useNavCollapse, useNFTCollections } from '../../../context'
import { checkMobile } from '../../../utils'
import { Loader } from '../../Farm/Columns'
import { WRAPPER_TABLE } from './NFTAggregator.styles'
import { NFTColumnsTitleMobile, NFTColumnsTitleWeb } from './NFTTableColumns'

const NFTCollectionsTable: FC<{ showBanner: boolean }> = ({ showBanner }) => {
  const { isCollapsed } = useNavCollapse()
  const { fetchAllCollections } = useNFTCollections()

  const [allItems, setAllItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
  useEffect(() => {
    ;(async () => {
      const res = await fetchAllCollections()
      setAllItems(res)
    })()
  }, [])

  return (
    <WRAPPER_TABLE $navCollapsed={isCollapsed} showBanner={showBanner}>
      <table>
        {!checkMobile() && (
          <thead className="tableHeader">
            {' '}
            <NFTColumnsTitleWeb />
          </thead>
        )}
        <tbody>
          {checkMobile() ? <NFTTableRowMobile allItems={allItems} /> : <NFTTableRow allItems={allItems} />}
        </tbody>
      </table>
    </WRAPPER_TABLE>
  )
}

const editString = (str: string) => {
  if (str.length > 12) return str.substring(0, 16) + '...'
  return str
}

const NFTTableRowMobile = ({ allItems }: any) => (
  <>
    {allItems.map((item, index) => (
      <tr className="tableRow" key={index}>
        <td className="index"> {index + 1}</td>
        <td className="nftNameColumn">
          {item?.collection_name ? (
            <>
              <img src={item.profile_pic_link} alt="" />
              <div className="nftCollectionName">{editString(item?.collection_name)}</div>
              <div className="nftCollectionFloor">
                <div className="grey">Floor: </div>
                <div> 250.2</div>
              </div>
            </>
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </td>
        <td className="tdItem">{item?.collection_name ? <> 0 </> : <Loader />}</td>
      </tr>
    ))}
  </>
)

const NFTTableRow = ({ allItems }: any) => (
  <>
    {allItems.map((item, index) => (
      <tr className="tableRow" key={index}>
        <td className="nftNameColumn">
          {item?.collection_name ? (
            <div>
              <img src={item.profile_pic_link} alt="" />
              <div className="nftCollectionName">{item?.collection_name}</div>
            </div>
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </td>
        <td className="tdItem">{item?.collection_name ? <>{item.collection_name} </> : <Loader />}</td>
        <td className="tdItem">{item?.collection_name ? <>{item.collection_name} </> : <Loader />}</td>
      </tr>
    ))}
  </>
)

export default NFTCollectionsTable
