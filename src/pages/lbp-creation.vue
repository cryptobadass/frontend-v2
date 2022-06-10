<template>
  <div>
    <div class="subsection">
      <h1>LBP Creation Walkthrough</h1>
      <h5>
        Creation url:
        <router-link :to="{ name: 'create-launchpad' }">
          <span className="link"
            >https://app.yotei.finance/#/launchpad/create</span
          >
        </router-link>
      </h5>
    </div>
    <div class="subsection">
      <h3>1. Input a valid ERC-20 contract address for your project token</h3>
      <p>
        <el-image
          style="width: 100%"
          :src="img1"
          :preview-src-list="list"
          :initial-index="0"
          fit="cover"
        />
      </p>
    </div>
    <div class="subsection">
      <h3>2. Input the number of ERC-20 tokens to be added to the LBP</h3>
    </div>
    <div class="subsection">
      <h3>
        3. Give those tokens an initial value by collateralizing them and
        selecting a start weight
      </h3>
      <p>
        The available collateral assets are WETH, DAI, or USDC. Liquidity will
        be provided with the resulting balances and weights. The value of the
        collateral can be potentially amplified by up to 99 times by weighing it
        as lower proportion within the liquidity pool.
      </p>
    </div>

    <div class="subsection">
      <h3>4. Set a duration for the LBP</h3>
    </div>
    <div class="subsection">
      <h3>5. Set the start and end weights for the LBP</h3>
      <p>
        <el-image
          style="width: 100%"
          :src="img2"
          :preview-src-list="list"
          :initial-index="1"
          fit="cover"
        />
      </p>
      <p>
        This step, in combination with the start weights and token balances,
        creates the price decay effect for LBPs.
      </p>
    </div>
    <div class="subsection">
      <h3>
        6. Set the project description, add a learn more URL, and configure the
        LBP swap fee
      </h3>
      <p>
        <el-image
          style="width: 100%"
          :src="img3"
          :preview-src-list="list"
          :initial-index="2"
          fit="cover"
        />
      </p>
    </div>
    <div class="subsection">
      <h3>
        7. Create and schedule the LBP by signing all the necessary transactions
      </h3>
      <p>
        <el-image
          style="width: 100%"
          :src="img4"
          :initial-index="3"
          :preview-src-list="list"
          fit="cover"
        />
      </p>
    </div>
    <div class="subsection">
      <h3>
        8. Enable trading within the LBP at exactly the time when the weights
        are scheduled to start changing (i.e. the start time of the LBP)
      </h3>
      <p>
        <el-image
          style="width: 100%"
          :src="img5"
          :initial-index="4"
          :preview-src-list="list"
          fit="cover"
        />
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import img1 from '@/assets/images/lbp-creation-1.png';
import img2 from '@/assets/images/lbp-creation-2.png';
import img3 from '@/assets/images/lbp-creation-3.png';
import img4 from '@/assets/images/lbp-creation-4.png';
import img5 from '@/assets/images/lbp-creation-5.png';
const list = [img1, img2, img3, img4, img5];
</script>
