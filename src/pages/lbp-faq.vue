<template>
  <div>
    <div class="subsection">
      <h1>FAQs</h1>
    </div>
    <div class="subsection">
      <h2>1. How should I choose a starting price?</h2>
      <p>
        You can think of the starting price of your LBP as the ceiling you’d
        want to set for the token. This may seem counterintuitive, but since
        LBPs work differently than other token liquidity platforms, your
        starting price should be set much higher than what you believe is the
        fair price.
      </p>
      <p>
        This does not mean you’re trying to sell the token above what it’s
        worth. Setting a high starting price allows the changing LBP weights to
        make their full impact, lowering the price progressively until a market
        equilibrium is reached. Unlike older token sale models such as bonding
        curves, LBP buyers are disincentivized to buy early, and instead benefit
        from waiting for the price to decrease until it reaches a level they
        believe is fair.
      </p>
      <p>
        For example, if you believe the fair price for your token is $1, you may
        want to consider an opening price that is up to $10.
      </p>
    </div>
    <div class="subsection">
      <h2>2. What's the difference between a batch auction and a LBP?</h2>
      <p>
        In batch auctions, a set amount of tokens are divided amongst
        individuals according to their contribution size. Nice and even across
        time, but this approach has its faults. It’s prone to be co-opted by
        whales, and can encourage botting or front-running to accumulate a large
        share
      </p>
      <p>
        LBPs start at a high price (probably more than you’d want to pay) and
        decrease according to a negative exponential curve. The price also moves
        when people buy in -- the more people buy, the higher the price goes.
      </p>
      <p>
        So if the decay curve is giving you too high a price, you can just wait
        for it to go down. But don’t wait too long or other people might drive
        the price back up.
      </p>
      <p>
        Using an LBP has several advantages over a batch auction. It allows the
        purchaser to know exactly how many tokens they will get for their money.
      </p>
      <p>
        It gives the purchaser more flexibility to get in at a price point that
        works for them. And it gives the token itself more integrity, as the
        price can reach a natural floor where demand matches the decay curve.
      </p>
    </div>
    <div class="subsection">
      <h2>3. How does Yotei's platform access charge work?</h2>
      <p>
        There are two platform access fee components for Yotei LBPs.
      </p>
      <p>
        The first is a swap fee that is set and collected by the project. This
        fee serves the purpose to discourage bots and traders from manipulating
        a LBP and ideally enables greater token distribution to community
        members. The typical range we have seen implemented by projects is
        between 1%-3%, and this fee is collected live during a LBP by the
        project team in both their main token (a user sells the main token into
        the LBP) as well as in the base token (a user buys the native token).
      </p>
      <p>
        The swap fee is automatically added to base tokens accrued and is
        withdrawn in one transaction at the conclusion of the LBP. There is no
        separate withdrawal of swap fees accrued throughout the course of the
        LBP. Balancer Pools automatically compound any swap fees earned to the
        balances inside of the pool. The base tokens earned via swaps would be
        added to the final collateral balance and main tokens earned would go to
        the final main token balance.
      </p>
      <p>
        The second fee is a platform access charge that is applied by Yotei at
        the conclusion of a LBP on total base tokens accrued. Base tokens
        accrued is inclusive of base tokens accrued + any swap fee. The platform
        access fee is a flat percentage fee that is automatically transferred to
        Yotei at the conclusion of a LBP.
      </p>
    </div>

    <div class="subsection">
      <h2>4. Does Yotei support Know Your Customer (KYC)?</h2>
      <p>
        Yotei supports KYC LBPs by configuring the UI, but the KYC requirements
        are conducted externally to Yotei. Previous KYC LBPs on Yotei conducted
        KYC by modifying their token contract to only allow whitelisted wallets
        to participate in the LBP, and worked with a third party KYC vendor to
        complete compliance requirements.
      </p>
      <p>
        If your project has a different method to conduct KYC for an LBP please
        reach out to the Yotei team to discuss feasibility.
      </p>
    </div>
  </div>
</template>
