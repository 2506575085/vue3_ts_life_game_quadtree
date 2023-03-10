import { Ref, ref } from 'vue'
import type {moveItem, CompareList } from './types'

export default function useCollisionDetection(compareList: Ref<CompareList>, changeDirection:(item:moveItem,crashDir:moveItem['direction'])=>void) {
  /**
   * 碰撞检测
   */
  function ifCrash() {
    /**
     * 碰撞规则：碰撞后向中心点连线外向移动，速率不变
     * @param itemChange 第一个碰撞元素
     * @param itemCrash 第二个碰撞元素
     * @returns 第一个碰撞元素碰撞后的速度
     */
    function getSpeed(itemChange:moveItem,itemCrash:moveItem) {
      let Xdir = itemChange.midPoint.x - itemCrash.midPoint.x
      let Ydir = itemChange.midPoint.y - itemCrash.midPoint.y
      let xSpeed = Math.abs(Xdir *itemChange.speed) / Math.sqrt(Math.pow(Ydir, 2) + Math.pow(Xdir, 2))
      xSpeed = (Xdir>0) ? xSpeed: (-xSpeed)
      let ySpeed = Math.abs((xSpeed / Xdir) * Ydir)
      ySpeed = (Ydir > 0) ? ySpeed : (-ySpeed)
      return { xSpeed, ySpeed }
    }
    compareList.value.forEach(compareItem => {
      if (compareItem.length == 2) {
        const f = compareItem[0]
        const s = compareItem[1]
        let crashed = false

        let l = Math.sqrt(Math.pow((f.midPoint.x - s.midPoint.x),2) + Math.pow((f.midPoint.y - s.midPoint.y),2))
        if (l <= ((f.size.width+s.size.width)/2)) {
          crashed = true
          // console.log('crash')
        }
        if (crashed) {
          const { xSpeed:sx,ySpeed:sy } = getSpeed(s, f)
          const { xSpeed:fx,ySpeed:fy } = getSpeed(f, s)

          //碰撞规则：碰撞后向中心点连线外向移动，速率不变
          // let sXSpeed = s.midPoint.x - f.midPoint.x
          // let sYSpeed = s.midPoint.y - f.midPoint.y
          // let sx = Math.abs(sXSpeed *s.speed) / Math.sqrt(Math.pow(sYSpeed, 2) + Math.pow(sXSpeed, 2))
          // sx = (sXSpeed>0) ? sx: (-sx)
          // let sy = Math.abs((sx / sXSpeed) * sYSpeed)
          // sy = (sYSpeed>0) ? sy: (-sy)

          // let fXSpeed = f.midPoint.x - s.midPoint.x
          // let fYSpeed = f.midPoint.y - s.midPoint.y
          // let fx = Math.abs(fXSpeed*f.speed) / Math.sqrt(Math.pow(fYSpeed, 2) + Math.pow(fXSpeed, 2))
          // fx = (fXSpeed>0) ? fx : (-fx)
          // let fy = Math.abs((fx / fXSpeed) * fYSpeed)
          // fy = (fYSpeed > 0) ? fy : (-fy)
          // console.log('s', Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2)))
          // console.log('f', Math.sqrt(Math.pow(fx, 2) + Math.pow(fy, 2)))
          changeDirection(s,{x:sx,y:sy})
          changeDirection(f,{x:fx,y:fy})
          // instance!.proxy!.$forceUpdate()
        } else {
          f.crashSize = 0
        }
      } else {
        compareItem[0].crashSize = 0
      }
    });
  }
  return {ifCrash}
}