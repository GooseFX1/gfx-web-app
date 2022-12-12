import React, { useEffect, useState, FC } from 'react'
import { useNavCollapse, useNFTCollections } from '../../../context'
import { Loader } from '../../Farm/Columns'
import { WRAPPER_TABLE } from './NFTAggregator.styles'
import { NFTColumnsTitleWeb } from './NFTTableColumns'

const NFTCollectionsTable: FC<{ showBanner: boolean }> = ({ showBanner }) => {
  const { isCollapsed } = useNavCollapse()
  const { fetchAllCollections } = useNFTCollections()

  const [allItems, setAllItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])
  useEffect(() => {
    ;(async () => {
      const res = await fetchAllCollections()
      setTimeout(() => {
        setAllItems(res)
      }, 2000)
    })()
  }, [])

  return (
    <WRAPPER_TABLE $navCollapsed={isCollapsed} showBanner={showBanner}>
      <table>
        <thead className="tableHeader">
          <NFTColumnsTitleWeb />
        </thead>
        <tbody>
          <NFTTableRow allItems={allItems} />
        </tbody>
      </table>
    </WRAPPER_TABLE>
  )
}

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
