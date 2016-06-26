#!/bin/bash

# Ensure local directory exists
mkdir -p local

# Generate Hostkey
ssh-keygen -t rsa -b 4096 -C "Red Router" -f "./local/host.key" -N "";
