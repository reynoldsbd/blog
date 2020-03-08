# Alef Board

This directory contains documentation pertaining to the Polos GD32V Alef Board,
which is a low cost, low power RISC-V MCU development kit. It is available for
purchase [from AnalogLamb][alef-board-analoglamb]:

The MCU around which this dev board is based, the GD32VF103, is also used on
many other development boards available online. Likely most, if not all, of the
information on this page is transferrable to those boards as well. Perhaps one
day I will re-title this document "The GD32V Platform"...

[alef-board-analoglamb]: https://www.analoglamb.com/product/polos-gd32v-alef-board-risc-v-mcu-board/


# Rust

https://github.com/riscv-rust/riscv-rust-quickstart
https://github.com/riscv-rust/gd32vf103-pac
https://github.com/riscv-rust/gd32vf103xx-hal
https://pramode.net/2019/10/07/rust-on-riscv-board-sipeed-longan-nano/


# Flashing

<!-- TODO: validate this information -->

The MCU features a bootloader mode that can be used to load new firmware. To
activate, hold the BOOT button while resetting the device. The bootloader
supports two flashing protocols:

1. DFU, using [a modified version of dfu-utils][gd32-dfu-utils]
   * The MCU does **not** comply with [the DFU specification][dfu-spec]
   * On Windows, need to use [Zadig][zadig] to configure WinUSB
2. STM32-compatible serial flashing, using [stm32flash][stm32flash]

Firmware can also be flashed directly via JTAG using OpenOCD. This approach
bypasses the bootloader.

<!-- TODO: is it possible to overwrite the bootloader? -->

[gd32-dfu-utils]: https://github.com/riscv-mcu/gd32-dfu-utils
[dfu-spec]: https://www.usb.org/sites/default/files/DFU_1.1.pdf
[zadig]: https://zadig.akeo.ie/
[stm32flash]: https://sourceforge.net/projects/stm32flash/


# GD32VF103 MCU

The MCU is a GigaDevice GD32VF103 series, which is essentially a RISC-V version
of the GD32 family of MCUs, which in turn are nearly clones of the ubiquitous
STM32 MCUs.

## Firmware Library

GigaDevice provides an [open source firmware library][gd32vf103-fwlib-gh]
complete with examples and project templates. The library includes high-level
routines for interfacing with peripherals found on the MCU, as well as build
scripts demonstrating how to compile and flash firmware for the device.

[gd32vf103-fwlib-gh]: https://github.com/riscv-mcu/GD32VF103_Firmware_Library/

## Documentation

The datasheet, user manual, and firmware library in this directory were all
downloaded from a GigaDevice "microsite" dedicated to GD32 MCUs:

http://www.gd32mcu.com/en/download/0?kw=GD32VF1

In the future, if this microsite becomes unavailable, you may be able to drill
down and find relevant content by starting at GigaDevice home page:

https://www.gigadevice.com/


# Bumblebee Core

The GD32VF103 series is based on the Bumblebee Core, which is a RV32IMAC
implementation co-developed by GigaDevice and Nuclei Systems.

## Documentation

The primary source of documentation for working with Bumblebee Cores seems to be
[this website][riscv-mcu-site], which unfortunately is only available in
Chinese. However, an English version of some of the site's content can be found
[on GitHub][riscv-mcu-site-gh].

The Bumblebee Core manuals in this directory are also available
[on GitHub][bumblebee-doc-gh].

[riscv-mcu-site]: https://www.riscv-mcu.com/
[riscv-mcu-site-gh]: https://github.com/riscv-mcu/Webpages
[bumblebee-doc-gh]: https://github.com/nucleisys/Bumblebee_Core_Doc


# Other Resources

https://www.susa.net/wordpress/2019/10/longan-nano-gd32vf103/
